#!/bin/bash

# Setup script for Python web scraper dependencies

echo "Setting up Python web scraper dependencies..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "✅ Python $python_version found"

# Install pip if not available
if ! command -v pip3 &> /dev/null; then
    echo "Installing pip3..."
    python3 -m ensurepip --upgrade
fi

# Install dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

echo "✅ Python web scraper setup complete!"
echo "You can now use the web scraper from your Node.js application." 