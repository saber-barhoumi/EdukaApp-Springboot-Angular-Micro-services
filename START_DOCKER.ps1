# START_DOCKER.ps1
# Run this script as Administrator to start Docker Desktop

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Docker Desktop Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor Yellow
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Check Docker Desktop Service
Write-Host "Checking Docker Desktop Service..." -ForegroundColor Cyan
$dockerService = Get-Service -Name "com.docker.service" -ErrorAction SilentlyContinue

if ($null -eq $dockerService) {
    Write-Host "❌ Docker Desktop Service not found!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Current Status: $($dockerService.Status)" -ForegroundColor Yellow

if ($dockerService.Status -eq "Running") {
    Write-Host "✅ Docker Desktop Service is already running!" -ForegroundColor Green
} else {
    Write-Host "Starting Docker Desktop Service..." -ForegroundColor Cyan
    try {
        Start-Service com.docker.service -ErrorAction Stop
        Write-Host "✅ Docker Desktop Service started successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start service: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Try these steps:" -ForegroundColor Yellow
        Write-Host "1. Open Docker Desktop manually from Start Menu" -ForegroundColor Yellow
        Write-Host "2. Wait for it to fully start (whale icon in system tray)" -ForegroundColor Yellow
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "Waiting for Docker Desktop to fully start..." -ForegroundColor Cyan
Write-Host "(This may take 30-60 seconds)" -ForegroundColor Gray

# Wait for Docker to be responsive
$maxAttempts = 30
$attempt = 0
$dockerReady = $false

while ($attempt -lt $maxAttempts -and -not $dockerReady) {
    $attempt++
    Write-Host "Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    
    try {
        $result = docker version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerReady = $true
            Write-Host "✅ Docker is ready!" -ForegroundColor Green
        } else {
            Start-Sleep -Seconds 2
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

if (-not $dockerReady) {
    Write-Host "⚠️  Docker Desktop may still be starting..." -ForegroundColor Yellow
    Write-Host "Please wait for the Docker whale icon to stop animating in the system tray" -ForegroundColor Yellow
    Write-Host ""
}

# Show Docker version
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Docker Version Information" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker version

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running Containers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker ps

Write-Host ""
Write-Host "✅ Docker Desktop is ready to use!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: docker-compose build admin-management-service" -ForegroundColor White
Write-Host "2. Run: docker-compose up" -ForegroundColor White
Write-Host ""

pause
