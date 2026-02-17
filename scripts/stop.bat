@echo off
title MYAPP_STOP_WINDOW

echo ==================================================
echo [STOP] Closing backend and client windows...
echo ==================================================

REM --- kill process base on port id---
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 " ^| findstr "LISTENING"') do (
  taskkill /PID %%a /T /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 " ^| findstr "LISTENING"') do (
  taskkill /PID %%a /T /F >nul 2>&1
)

REM --- match window title---
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Get-Process -Name cmd -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*MYAPP_BACKEND_WINDOW*' -or $_.MainWindowTitle -like '*MYAPP_CLIENT_WINDOW*' -or $_.MainWindowTitle -like '*MYAPP_START_WINDOW*' } | ForEach-Object { taskkill /PID $_.Id /T /F }" >nul 2>&1

echo Done.
timeout /t 1 /nobreak >nul

REM --- close self---
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Get-Process -Name cmd -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*MYAPP_STOP_WINDOW*' } | ForEach-Object { Stop-Process -Id $_.Id -Force }"