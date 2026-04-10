# GoDaddy Static WebApp Deployment Script
# Packages the Static Next.js export for ANY hosting (FTP)

$ProjectDir = $PSScriptRoot
$ZipPath = "$ProjectDir\..\billing-app-static.zip"

Write-Host "Creating Static WebApp Deployment Package..." -ForegroundColor Cyan

# 1. Run the build
Write-Host "Building project (Static Export)..." -ForegroundColor Yellow
# Note: Ensure you have set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment
npm run build

# 2. Verify output
if (Test-Path "$ProjectDir\out") {
    Write-Host "Static export successful. Packaging 'out' folder..." -ForegroundColor Green
    
    # 3. Create ZIP
    if (Test-Path $ZipPath) { Remove-Item -Force $ZipPath }
    Compress-Archive -Path "$ProjectDir\out\*" -DestinationPath $ZipPath -Force

    Write-Host "`nSUCCESS! Your Static WebApp is ready." -ForegroundColor Green
    Write-Host "Location: $ZipPath" -ForegroundColor White
    Write-Host "`nNext Steps for GoDaddy:" -ForegroundColor Cyan
    Write-Host "1. Upload and Extract this ZIP in your 'public_html' folder." -ForegroundColor White
    Write-Host "2. That's it! No Node.js configuration required." -ForegroundColor White
} else {
    Write-Host "`nERROR: Build folder 'out' not found. Check build logs above." -ForegroundColor Red
}
