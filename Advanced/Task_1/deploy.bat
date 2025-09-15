@echo off
REM CodeVA Full-Stack Application Deployment Script for Windows
REM Author: Yakubu Abdul Manaf

setlocal enabledelayedexpansion

echo 🚀 Starting CodeVA Full-Stack Application Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Environment selection
set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

echo [INFO] Deployment environment: %ENVIRONMENT%

if "%ENVIRONMENT%"=="production" (
    set COMPOSE_FILE=docker-compose.prod.yml
    echo [WARNING] Production deployment requires proper environment variables!
    echo [WARNING] Please ensure .env.production files are configured with secure values.
) else (
    set COMPOSE_FILE=docker-compose.yml
)

REM Stop existing containers
echo [INFO] Stopping existing containers...
docker-compose -f %COMPOSE_FILE% down --remove-orphans

REM Pull latest images
echo [INFO] Pulling latest base images...
docker-compose -f %COMPOSE_FILE% pull

REM Build and start services
echo [INFO] Building and starting services...
docker-compose -f %COMPOSE_FILE% up --build -d

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service health
echo [INFO] Checking service health...

REM Check API health
curl -f http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] API is not ready
    pause
    exit /b 1
) else (
    echo [SUCCESS] API is ready
)

REM Check Frontend
curl -f http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Frontend is not ready
    pause
    exit /b 1
) else (
    echo [SUCCESS] Frontend is ready
)

echo [SUCCESS] 🎉 Deployment completed successfully!
echo [INFO] Services are running:
echo [INFO]   - Frontend: http://localhost:3000
echo [INFO]   - API: http://localhost:5000
echo [INFO]   - Health Check: http://localhost:5000/health

if "%ENVIRONMENT%"=="production" (
    echo [INFO]   - Nginx Proxy: http://localhost:80
)

echo [INFO] To view logs: docker-compose -f %COMPOSE_FILE% logs -f
echo [INFO] To stop services: docker-compose -f %COMPOSE_FILE% down

pause
