# Python Web Scraper

This directory contains a robust Python web scraper designed to handle job posting URLs with anti-bot detection features.

## Features

- **Anti-bot Detection**: Rotating user agents, proper headers, and site-specific configurations
- **Retry Logic**: Automatic retries with exponential backoff
- **Site-Specific Handling**: Optimized for Indeed, LinkedIn, Glassdoor, and other job sites
- **Fallback Support**: Graceful fallback to existing Node.js scraping methods
- **Error Handling**: Comprehensive error detection and reporting

## Setup

### Prerequisites

- Python 3.8 or higher
- pip3 (Python package manager)

### Installation

#### On Linux/macOS:
```bash
chmod +x setup.sh
./setup.sh
```

#### On Windows:
```cmd
setup.bat
```

#### Manual Installation:
```bash
pip3 install -r requirements.txt
```

## Usage

### From Node.js

The scraper is integrated into the `createUpdateInterview` function and will automatically be used when a `jobUrl` is provided.

### Direct Python Usage

```bash
python3 web_scraper.py "https://www.indeed.com/viewjob?jk=123456789"
```

### Output Format

The scraper returns JSON with the following structure:

```json
{
  "success": true,
  "html": "<!DOCTYPE html>..."
}
```

Or on error:

```json
{
  "success": false,
  "error": "Error description"
}
```

## Anti-Bot Features

### User Agent Rotation
- Multiple realistic user agents
- Random selection for each request

### Headers
- Proper Accept headers
- Language and encoding headers
- Security headers (Sec-Fetch-*)

### Site-Specific Configurations
- **Indeed.com**: Referer headers, cookies, longer delays
- **LinkedIn.com**: Referer headers, moderate delays
- **Glassdoor.com**: Referer headers, shorter delays

### Rate Limiting
- Random delays between requests
- Site-specific delay ranges
- Retry logic with increasing delays

### Bot Detection Avoidance
- Checks for captcha, robot, blocked, access denied
- Validates content length and quality
- Handles HTTP status codes appropriately

## Error Handling

The scraper handles various error scenarios:

- **Network timeouts**: Automatic retries with backoff
- **HTTP errors**: Status code specific handling
- **Bot detection**: Detection and reporting of blocking
- **Invalid content**: Validation of scraped content
- **Python availability**: Graceful fallback to Node.js methods

## Integration

The scraper is integrated into the Node.js application through:

1. `pythonScraper.ts` - Utility functions for calling Python
2. `fetchJobPostingHtmlWithPython()` - Main integration function
3. Automatic fallback to existing methods if Python is unavailable

## Troubleshooting

### Python Not Found
- Ensure Python 3 is installed and accessible via `python3`
- Check PATH environment variable
- Try running `python3 --version` in terminal

### Dependencies Missing
- Run the setup script again
- Manually install: `pip3 install requests beautifulsoup4 lxml urllib3`

### Permission Errors
- Ensure the Python script is executable: `chmod +x web_scraper.py`
- Check file permissions in the scraper directory

### Scraping Failures
- Check if the target site has changed their structure
- Verify the URL is accessible in a browser
- Check for rate limiting or IP blocking 