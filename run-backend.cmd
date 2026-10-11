@echo off
echo ========================================================
echo  Starting CampusEventHub Spring Boot Backend (Port 8080)
echo ========================================================
cd /d "%~dp0student-event-system\backend"
call "%~dp0mvn.cmd" spring-boot:run "-Dspring-boot.run.profiles=h2"
pause
