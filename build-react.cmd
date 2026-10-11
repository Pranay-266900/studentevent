@echo off
echo ========================================================
echo  Building React Frontend for Production
echo ========================================================
set PATH=%~dp0tools\node-v20.18.0-win-x64;%PATH%
cd /d "%~dp0student-event-system\frontend-react"
call npm.cmd run build
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Copying production assets to Spring Boot static folder...
    xcopy /Y /E /I "%~dp0student-event-system\frontend-react\dist\*" "%~dp0student-event-system\backend\src\main\resources\static\"
    xcopy /Y /E /I "%~dp0student-event-system\frontend-react\dist\*" "%~dp0student-event-system\backend\target\classes\static\"
    echo.
    echo React build successfully deployed into Spring Boot backend!
) else (
    echo.
    echo [ERROR] React build failed!
)
pause
