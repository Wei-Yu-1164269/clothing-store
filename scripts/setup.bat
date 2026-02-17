@echo off
setlocal

echo ==================================================
echo [SETUP] Install dependencies (client + backend)
echo ==================================================

cd /d "%~dp0\.."

REM --- Check node/npm ---
where node >nul 2>&1 || (echo [ERROR] Node.js not found. Install Node 18+ from https://nodejs.org/ & pause & exit /b 1)
where npm  >nul 2>&1 || (echo [ERROR] npm not found. Reinstall Node.js. & pause & exit /b 1)

REM --- Check python ---
where python >nul 2>&1 || (echo [ERROR] Python not found. Install Python 3.10+ from https://www.python.org/downloads/ & pause & exit /b 1)

echo.
echo ==================================================
echo [SETUP] Frontend: npm install
echo ==================================================
cd /d "%~dp0\..\client"
if exist package-lock.json (
  call npm ci
) else (
  call npm install
)
if errorlevel 1 (echo [ERROR] Frontend install failed. & pause & exit /b 1)

echo.
echo ==================================================
echo [SETUP] Backend: venv + pip install
echo ==================================================
cd /d "%~dp0\..\backend"

if not exist ".venv" (
  python -m venv .venv
)

call ".venv\Scripts\activate.bat"

if exist requirements.txt (
  pip install -r requirements.txt
) else (
  echo [WARN] requirements.txt not found in backend\
  echo        You should create it: pip freeze ^> backend\requirements.txt
)

echo.
echo ==================================================
echo [SETUP] Done. Next: scripts\start.bat
echo ==================================================
pause
