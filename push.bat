@echo off
set "PATH=C:\Users\Dell\MinGit\cmd;C:\Users\Dell\MinGit\mingw64\bin;%PATH%"
echo ========================================================
echo   StockSense - Pushing to GitHub (Odoo-Hackathon-)
echo ========================================================
echo.
echo Connecting to GitHub repository...
echo If a GitHub sign-in window opens in your browser, please approve it.
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] All code has been successfully pushed to:
    echo https://github.com/sprabhu0809-ind/Odoo-Hackathon-
) else (
    echo [ERROR] Push failed. Please check the error message above.
)
echo.
pause
