@echo off

REM Setup script for Python web scraper dependencies (Windows)

echo Setting up Python web scraper dependencies...

REM Check if Python 3 is installed
python3 --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3 is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%i in ('python3 --version 2^>^&1') do set python_version=%%i
echo ✅ Python %python_version% found

REM Install pip if not available
pip3 --version >nul 2>&1
if errorlevel 1 (
    echo Installing pip3...
    python3 -m ensurepip --upgrade
)

REM Install dependencies
echo Installing Python dependencies...
pip3 install -r requirements.txt

echo ✅ Python web scraper setup complete!
echo You can now use the web scraper from your Node.js application.
pause 