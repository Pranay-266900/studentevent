@echo off
echo ========================================================
echo  Starting CampusEventHub React Frontend (Vite Dev Server)
echo ========================================================
set PATH=%~dp0tools\node-v20.18.0-win-x64;%PATH%
cd /d "%~dp0student-event-system\frontend-react"
call npm.cmd run dev
pause
