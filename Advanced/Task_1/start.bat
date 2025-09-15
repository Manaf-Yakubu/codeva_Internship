@echo off
echo ========================================
echo   Enhanced PERN Application Startup
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd server && echo Backend starting on port 5001... && node simple-server.js"

echo [2/2] Waiting 3 seconds then starting Frontend...
timeout /t 3 /nobreak >nul

start "Frontend Server" cmd /k "cd client && echo Frontend starting on port 3000... && npm run dev"

echo.
echo ========================================
echo   Application Starting...
echo ========================================
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5001
echo   
echo   Demo Credentials:
echo   Admin: admin@codeva.com / Admin123!
echo   User:  user@codeva.com / User123!
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
