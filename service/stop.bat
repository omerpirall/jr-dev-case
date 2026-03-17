@echo off
cd /d %~dp0

echo [INFO] Stopping launcher...
taskkill /IM launcher.exe /F >nul 2>&1

echo [INFO] Stopping Windows service...
.\jr-dev-service.exe stop