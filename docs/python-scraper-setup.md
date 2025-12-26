# Python Web Scraper Setup Guide

This guide will help you set up the Python web scraper that has been integrated into the `createUpdateInterview` function.

## What's New

The `createUpdateInterview` function now uses a robust Python web scraper when a `jobUrl` is provided. This scraper includes:

- **Anti-bot detection features** (rotating user agents, proper headers)
- **Site-specific optimizations** for Indeed, LinkedIn, Glassdoor, etc.
- **Automatic retry logic** with exponential backoff
- **Graceful fallback** to existing Node.js methods if Python is unavailable

## Setup Instructions

### 1. Install Python Dependencies

#### Option A: Using npm script (Recommended)
```bash
cd server
npm run setup:python
```

#### Option B: Manual installation
```bash
cd server/scraper
pip3 install -r requirements.txt
```

#### Option C: Using setup scripts
- **Linux/macOS**: `chmod +x server/scraper/setup.sh && ./server/scraper/setup.sh`
- **Windows**: `server/scraper/setup.bat`

### 2. Test the Installation

```bash
cd server
npm run test:scraper
```

This will verify that all dependencies are installed and the scraper is working correctly.

### 3. Verify Python is Available

The system will automatically check if Python 3 is available. You can verify this by running:

```bash
python3 --version
```

## How It Works

### Integration Flow

1. When `createUpdateInterview` is called with `useJobUrl: true` and a `jobUrl`
2. The system first checks if Python 3 is available
3. If available, it calls the Python scraper with anti-bot features
4. If Python is not available or the scraper fails, it falls back to existing methods (axios + Puppeteer)
5. The scraped HTML is then processed by the AI to extract job information and generate interview questions

### Anti-Bot Features

The Python scraper includes several features to avoid bot detection:

- **Rotating User Agents**: Uses different browser user agents for each request
- **Proper Headers**: Sets realistic HTTP headers that browsers use
- **Site-Specific Configurations**: Optimized settings for popular job sites
- **Random Delays**: Adds realistic delays between requests
- **Retry Logic**: Automatically retries failed requests with backoff

### Supported Sites

The scraper is optimized for:
- **Indeed.com** - Job postings with specific headers and cookies
- **LinkedIn.com** - Professional job listings
- **Glassdoor.com** - Company reviews and job postings
- **Generic sites** - Fallback configuration for other job sites

## Troubleshooting

### Python Not Found
```
Error: Failed to start Python process: spawn python3 ENOENT
```

**Solution**: Install Python 3.8 or higher and ensure it's in your PATH.

### Dependencies Missing
```
ModuleNotFoundError: No module named 'requests'
```

**Solution**: Run `npm run setup:python` or manually install dependencies.

### Permission Errors
```
Error: EACCES: permission denied
```

**Solution**: Ensure the Python script is executable and you have proper permissions.

### Scraping Failures
If the scraper fails to get content from a specific site:

1. Check if the URL is accessible in a browser
2. The system will automatically fall back to existing methods
3. Check the logs for specific error messages
4. Some sites may have changed their structure or increased bot protection

## Configuration

### Environment Variables

No additional environment variables are required. The scraper uses the same configuration as the existing system.

### Customization

You can modify the scraper behavior by editing:
- `server/scraper/web_scraper.py` - Main scraper logic
- `server/src/utils/pythonScraper.ts` - Node.js integration

## Performance

- **First request**: May take 2-5 seconds due to Python startup
- **Subsequent requests**: Typically 1-3 seconds
- **Fallback time**: Similar to existing methods (5-15 seconds)

## Monitoring

The system logs the scraping process with emojis for easy identification:
- 🐍 Python scraper being used
- ✅ Successful scraping
- ❌ Failed scraping
- ⚠️ Python not available
- 🔄 Falling back to existing methods

## Support

If you encounter issues:

1. Check the console logs for detailed error messages
2. Run `npm run test:scraper` to verify the installation
3. Ensure Python 3 is properly installed and accessible
4. The system will automatically fall back to existing methods if needed 