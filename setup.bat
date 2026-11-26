@echo off
title Ronger Bari Hennal - setup + start
cd /d "%~dp0"
start "" cmd /c "timeout /t 25 >nul & start http://localhost:3000"
call npm run dev
pause
