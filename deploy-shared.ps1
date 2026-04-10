# GoDaddy cPanel Shared Hosting Deployment Script
# Packages the Standalone Next.js build for cPanel Node.js Selector

$ProjectDir = $PSScriptRoot
$ZipPath = "$ProjectDir\..\billing-app-shared.zip"
$TempDir = "$ProjectDir\..\billing-app-standalone-temp"

Write-Host "Creating Shared Hosting Deployment Package..." -ForegroundColor Cyan

# 1. Run the build
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# 2. Prepare Temp Directory
if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir }
New-Item -ItemType Directory -Path $TempDir | Out-Null

# 3. Copy Standalone files (The core of the app)
Write-Host "Copying standalone build..." -ForegroundColor Yellow
Copy-Item -Path "$ProjectDir\.next\standalone\*" -Destination $TempDir -Recurse

# 4. Copy Static files (Next.js standalone doesn't include these by default)
Write-Host "Copying static assets..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$TempDir\.next\static" | Out-Null
Copy-Item -Path "$ProjectDir\.next\static\*" -Destination "$TempDir\.next\static" -Recurse

New-Item -ItemType Directory -Path "$TempDir\public" | Out-Null
Copy-Item -Path "$ProjectDir\public\*" -Destination "$TempDir\public" -Recurse

# 5. Copy Prisma & Database
Write-Host "Copying database and schema..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "$TempDir\prisma" | Out-Null
Copy-Item -Path "$ProjectDir\prisma\schema.prisma" -Destination "$TempDir\prisma\"
if (Test-Path "$ProjectDir\prisma\dev.db") {
    Copy-Item -Path "$ProjectDir\prisma\dev.db" -Destination "$TempDir\prisma\"
}

# 6. Copy root server and config
Copy-Item -Path "$ProjectDir\server.js" -Destination $TempDir
Copy-Item -Path "$ProjectDir\package.json" -Destination $TempDir
if (Test-Path "$ProjectDir\.env") {
    Copy-Item -Path "$ProjectDir\.env" -Destination $TempDir
}

# 7. Create ZIP
Write-Host "Creating ZIP: $ZipPath" -ForegroundColor Green
if (Test-Path $ZipPath) { Remove-Item -Force $ZipPath }
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force

# 8. Cleanup
# Remove-Item -Recurse -Force $TempDir

Write-Host "`nSUCCESS! Your deployment package is ready." -ForegroundColor Green
Write-Host "Location: $ZipPath" -ForegroundColor White
Write-Host "`nNext Steps for GoDaddy cPanel:" -ForegroundColor Cyan
Write-Host "1. Upload and Extract this ZIP in your hosting root." -ForegroundColor White
Write-Host "2. Use 'Setup Node.js App' in cPanel." -ForegroundColor White
Write-Host "3. Set Application entry point to 'server.js'." -ForegroundColor White
Write-Host "4. Run 'NPM Install' and Restart." -ForegroundColor White
