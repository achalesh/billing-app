# GoDaddy Deployment Script
# Packages the pre-built Next.js app for GoDaddy Node.js hosting
# Run from the billing-app root directory

$ProjectDir = $PSScriptRoot
$ZipPath = "$ProjectDir\..\billing-app-deploy.zip"
$TempDir = "$ProjectDir\..\billing-app-temp"

Write-Host "Preparing GoDaddy deployment package..." -ForegroundColor Cyan

# Clean up temp dir if it exists
if (Test-Path $TempDir) {
    Remove-Item -Recurse -Force $TempDir
}

# Copy project to temp dir (exclude node_modules, .git, *.db, dev files)
$Excludes = @(
    'node_modules', '.git', '*.db', '*.db-journal',
    '.next\cache', '.next\dev', # Strip dev/cache from .next but keep build output
    'billing-app-deploy.zip', 'deploy-godaddy.ps1'
)

Write-Host "Copying project files..." -ForegroundColor Yellow
Copy-Item -Path $ProjectDir -Destination $TempDir -Recurse -Exclude $Excludes

# Remove excluded subfolders manually (Copy-Item -Exclude doesn't work on subdirs reliably)
$FoldersToRemove = @(
    "$TempDir\node_modules",
    "$TempDir\.git",
    "$TempDir\.next\cache",
    "$TempDir\.next\dev"
)
foreach ($folder in $FoldersToRemove) {
    if (Test-Path $folder) {
        Remove-Item -Recurse -Force $folder
        Write-Host " Removed: $folder" -ForegroundColor Gray
    }
}

# Remove Windows-specific Prisma query engine binaries (Linux will regenerate via prisma generate)
Get-ChildItem -Path "$TempDir" -Recurse -Filter "query_engine-windows*" | Remove-Item -Force
Get-ChildItem -Path "$TempDir" -Recurse -Filter "*.db" | Remove-Item -Force

# Modify package.json: change build script to only run prisma generate
# (since .next is pre-built, GoDaddy doesn't need to run next build)
$PkgPath = "$TempDir\package.json"
$PkgContent = Get-Content $PkgPath -Raw

# Use regex to replace the prebuild and build scripts safely
$PkgContent = $PkgContent -replace '"prebuild":\s*"[^"]*"', '"prebuild": ""'
$PkgContent = $PkgContent -replace '"build":\s*"[^"]*"', '"build": "prisma generate && prisma migrate deploy"'

Set-Content -Path $PkgPath -Value $PkgContent -Encoding UTF8 -NoNewline
Write-Host "Updated package.json build script for GoDaddy" -ForegroundColor Yellow

# Create zip
if (Test-Path $ZipPath) {
    Remove-Item -Force $ZipPath
}

Write-Host "Creating zip file..." -ForegroundColor Yellow
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force

# Cleanup temp
Remove-Item -Recurse -Force $TempDir

$ZipSize = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "SUCCESS! Deployment package ready:" -ForegroundColor Green
Write-Host "  Path: $ZipPath" -ForegroundColor White
Write-Host "  Size: $ZipSize MB" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Upload billing-app-deploy.zip to GoDaddy Node.js hosting" -ForegroundColor White
Write-Host "  2. Set environment variable: DATABASE_URL = file:./dev.db" -ForegroundColor White
Write-Host "  3. Set environment variable: NODE_ENV = production" -ForegroundColor White
