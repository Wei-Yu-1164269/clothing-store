@echo off
setlocal

title MYAPP_START_WINDOW

set "ROOT=%~dp0.."
set "PIDDIR=%ROOT%\scripts"

del /q "%PIDDIR%\backend.pid" "%PIDDIR%\client.pid" >nul 2>&1

echo ==================================================
echo [START] Launching backend and client...
echo Repo root: %ROOT%
echo ==================================================

REM --- 启动后端 ---
start "MYAPP_BACKEND_WINDOW" /D "%ROOT%\backend" cmd /k "title MYAPP_BACKEND_WINDOW && (if exist .venv\Scripts\activate.bat call .venv\Scripts\activate.bat) && python app.py"

REM --- 启动前端 ---
start "MYAPP_CLIENT_WINDOW" /D "%ROOT%\client" cmd /k "title MYAPP_CLIENT_WINDOW && npm run dev"

echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo close all windows : scripts\stop.bat
echo ==================================================
pause