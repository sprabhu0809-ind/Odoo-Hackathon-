$env:PATH = "C:\Users\Dell\MinGit\cmd;C:\Users\Dell\MinGit\mingw64\bin;" + $env:PATH

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  StockSense - Pushing to GitHub (Odoo-Hackathon-)     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pushing all 35+ project files to https://github.com/sprabhu0809-ind/Odoo-Hackathon- ..." -ForegroundColor Yellow
Write-Host ""

& "C:\Users\Dell\MinGit\cmd\git.exe" push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] ALL CODE IS NOW VISIBLE IN YOUR REPO:" -ForegroundColor Green
    Write-Host "https://github.com/sprabhu0809-ind/Odoo-Hackathon-`n" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Push failed. Check the message above." -ForegroundColor Red
}
