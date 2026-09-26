@echo off
cd /d "C:\Users\Dell\stocksense"
set "PATH=C:\Users\Dell\MinGit\cmd;C:\Users\Dell\MinGit\mingw64\bin;%PATH%"
cls
echo ====================================================================
echo   StockSense - Pushing All Code to GitHub (Odoo-Hackathon-)
echo ====================================================================
echo.
echo Repo URL: https://github.com/sprabhu0809-ind/Odoo-Hackathon-
echo Branch  : main
echo.
echo Pushing your latest code...
echo.
echo (NOTE: If GitHub asks for sign-in, click "Sign in with your browser")
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================================
    echo [SUCCESS] ALL YOUR CODE IS NOW LIVE IN YOUR GITHUB REPO!
    echo Visit: https://github.com/sprabhu0809-ind/Odoo-Hackathon-
    echo ====================================================================
) else (
    echo ====================================================================
    echo [NOTICE] If browser login didn't pop up or authentication failed,
    echo make sure your GitHub account has write access to sprabhu0809-ind/Odoo-Hackathon-
    echo ====================================================================
)
echo.
pause
