@echo off
cd /d %~dp0

REM Python server exe'yi başlat
start "" "..\python-app\dist\server.exe"

REM Server'ın ayağa kalkması için kısa bekleme
timeout /t 3 /nobreak >nul

REM Frontend'i varsayılan tarayıcıda aç
start "" "http://127.0.0.1:8000"