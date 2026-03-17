@echo off
cd /d %~dp0

echo [INFO] Starting Windows service...
.\jr-dev-service.exe start

timeout /t 3 >nul

echo [INFO] Starting launcher...
start "" ".\dist\launcher\launcher.exe"