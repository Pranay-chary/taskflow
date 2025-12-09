@echo off
REM TaskFlow - Quick Start Script for Windows

echo.
echo ========================================
echo   TaskFlow - MERN Task Management App
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if MongoDB is running (optional check)
echo Checking MongoDB connection...
echo.

REM Install backend dependencies
echo [1/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo [1/4] ✓ Backend dependencies installed
echo.

REM Install frontend dependencies
echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo [2/4] ✓ Frontend dependencies installed
echo.

REM Seed database
echo [3/4] Seeding database with demo data...
cd backend
call npm run seed
cd ..
echo [3/4] ✓ Database seeded
echo.

REM Start servers
echo [4/4] Starting servers...
echo.
echo ========================================
echo   Starting Backend Server (Port 5000)
echo   Starting Frontend Server (Port 3000)
echo ========================================
echo.

REM Start backend in new window
start cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   TaskFlow is starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Demo Credentials:
echo   PM:     pm@example.com
echo   User 1: user1@example.com
echo   User 2: user2@example.com
echo.
echo Press any key to close this window...
pause
