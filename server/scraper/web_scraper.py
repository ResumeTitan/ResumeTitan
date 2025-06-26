#!/usr/bin/env python3
"""
Web Scraper for Job Postings
Handles bot detection and provides robust scraping capabilities
"""

import requests
import json
import sys
import time
import random
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import logging
from typing import Dict, Optional, List
import os
import re
from fake_useragent import UserAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebScraper:
    def __init__(self):
        self.session = requests.Session()
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
        ]
        
        # Enhanced headers that make requests look more legitimate
        self.base_headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'DNT': '1',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"'
        }
        
        # Enhanced site-specific configurations
        self.site_configs = {
            'indeed.com': {
                'headers': {
                    'Referer': 'https://www.indeed.com/',
                    'Sec-Fetch-Site': 'same-origin',
                    'Origin': 'https://www.indeed.com'
                },
                'cookies': {
                    'CTK': '1',
                    'CO': 'US',
                    'INDEED_CSRF_TOKEN': 'dummy_token',
                    'PREF': 'TM=1234567890:LD=en_US:TM=1234567890'
                },
                'wait_time': (3, 7),
                'max_retries': 4
            },
            'linkedin.com': {
                'headers': {
                    'Referer': 'https://www.linkedin.com/',
                    'Sec-Fetch-Site': 'same-origin',
                    'Origin': 'https://www.linkedin.com'
                },
                'cookies': {
                    'li_gc': 'dummy_value',
                    'JSESSIONID': 'dummy_session'
                },
                'wait_time': (4, 8),
                'max_retries': 3
            },
            'glassdoor.com': {
                'headers': {
                    'Referer': 'https://www.glassdoor.com/',
                    'Sec-Fetch-Site': 'same-origin',
                    'Origin': 'https://www.glassdoor.com'
                },
                'cookies': {
                    'gdId': 'dummy_id',
                    'gdToken': 'dummy_token'
                },
                'wait_time': (2, 5),
                'max_retries': 3
            },
            'monster.com': {
                'headers': {
                    'Referer': 'https://www.monster.com/',
                    'Sec-Fetch-Site': 'same-origin',
                    'Origin': 'https://www.monster.com'
                },
                'wait_time': (2, 4),
                'max_retries': 3
            },
            'careerbuilder.com': {
                'headers': {
                    'Referer': 'https://www.careerbuilder.com/',
                    'Sec-Fetch-Site': 'same-origin',
                    'Origin': 'https://www.careerbuilder.com'
                },
                'wait_time': (2, 4),
                'max_retries': 3
            }
        }

    def get_site_config(self, url: str) -> Dict:
        """Get site-specific configuration based on URL"""
        domain = urlparse(url).netloc.lower()
        for site_domain, config in self.site_configs.items():
            if site_domain in domain:
                return config
        return {'headers': {}, 'cookies': {}, 'wait_time': (2, 4), 'max_retries': 3}

    def setup_session(self, url: str):
        """Setup session with appropriate headers and cookies"""
        config = self.get_site_config(url)
        
        # Set random user agent
        headers = self.base_headers.copy()
        headers['User-Agent'] = random.choice(self.user_agents)
        headers.update(config.get('headers', {}))
        
        # Add some randomization to headers
        if random.choice([True, False]):
            headers['Accept-Language'] = 'en-US,en;q=0.8'
        if random.choice([True, False]):
            headers['DNT'] = '0'
        
        self.session.headers.update(headers)
        
        # Set cookies if specified
        for name, value in config.get('cookies', {}).items():
            self.session.cookies.set(name, value, domain=urlparse(url).netloc)

    def add_random_delay(self, url: str):
        """Add random delay to avoid rate limiting"""
        config = self.get_site_config(url)
        min_wait, max_wait = config.get('wait_time', (2, 4))
        delay = random.uniform(min_wait, max_wait)
        time.sleep(delay)

    def simulate_human_behavior(self):
        """Simulate human-like behavior patterns"""
        # Random small delays
        time.sleep(random.uniform(0.1, 0.5))
        
        # Sometimes add a longer pause
        if random.random() < 0.2:
            time.sleep(random.uniform(1, 2))

    def check_for_bot_detection(self, content: str) -> Optional[str]:
        """Enhanced bot detection checking"""
        content_lower = content.lower()
        
        # Common bot detection indicators
        bot_indicators = [
            'captcha', 'robot', 'blocked', 'access denied', 'forbidden',
            'please verify', 'security check', 'cloudflare', 'ddos protection',
            'rate limit', 'too many requests', 'suspicious activity',
            'please wait', 'checking your browser', 'javascript required',
            'human verification', 'bot detected', 'automated access',
            'security challenge', 'challenge page'
        ]
        
        for indicator in bot_indicators:
            if indicator in content_lower:
                return f"Bot detection detected: {indicator}"
        
        # Check for common blocking patterns
        if re.search(r'blocked|forbidden|denied', content_lower, re.IGNORECASE):
            return "Access blocked or forbidden"
        
        # Check for insufficient content
        if len(content) < 1000:
            return "Insufficient content received"
        
        # Check for error pages
        error_patterns = [
            r'error\s+\d{3}', r'page\s+not\s+found', r'404',
            r'server\s+error', r'temporarily\s+unavailable'
        ]
        
        for pattern in error_patterns:
            if re.search(pattern, content_lower, re.IGNORECASE):
                return f"Error page detected: {pattern}"
        
        return None

    def scrape_url(self, url: str, max_retries: int = None) -> Dict[str, str]:
        """
        Scrape a URL and return the HTML content
        Returns: {'html': str, 'error': str or None}
        """
        config = self.get_site_config(url)
        max_retries = max_retries or config.get('max_retries', 3)
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Attempting to scrape {url} (attempt {attempt + 1}/{max_retries})")
                
                # Setup session for this URL
                self.setup_session(url)
                
                # Add random delay
                self.add_random_delay(url)
                
                # Simulate human behavior
                self.simulate_human_behavior()
                
                # Make the request with enhanced settings
                response = self.session.get(
                    url,
                    timeout=30,
                    allow_redirects=True,
                    verify=True,
                    stream=False
                )
                
                # Check response status
                if response.status_code == 200:
                    content = response.text
                    
                    # Check for bot detection
                    bot_detection = self.check_for_bot_detection(content)
                    if bot_detection:
                        raise Exception(bot_detection)
                    
                    logger.info(f"Successfully scraped {url} - {len(content)} characters")
                    return {'html': content, 'error': None}
                
                elif response.status_code == 403:
                    raise Exception("Access forbidden - possible bot detection")
                elif response.status_code == 429:
                    raise Exception("Rate limited - too many requests")
                elif response.status_code == 503:
                    raise Exception("Service temporarily unavailable")
                elif response.status_code >= 500:
                    raise Exception(f"Server error: {response.status_code}")
                else:
                    raise Exception(f"HTTP {response.status_code}: {response.reason}")
                    
            except requests.exceptions.Timeout:
                logger.warning(f"Timeout on attempt {attempt + 1}")
                if attempt == max_retries - 1:
                    return {'html': '', 'error': 'Request timeout'}
                    
            except requests.exceptions.RequestException as e:
                logger.warning(f"Request error on attempt {attempt + 1}: {str(e)}")
                if attempt == max_retries - 1:
                    return {'html': '', 'error': f'Request failed: {str(e)}'}
                    
            except Exception as e:
                logger.warning(f"Error on attempt {attempt + 1}: {str(e)}")
                if attempt == max_retries - 1:
                    return {'html': '', 'error': str(e)}
            
            # Wait before retry with exponential backoff
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.uniform(1, 3)
                logger.info(f"Waiting {wait_time:.1f} seconds before retry...")
                time.sleep(wait_time)
        
        return {'html': '', 'error': 'All retry attempts failed'}

def main():
    """Main function to handle command line usage"""
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python web_scraper.py <url>'
        }))
        sys.exit(1)
    
    url = sys.argv[1]
    
    # Validate URL
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            raise ValueError("Invalid URL format")
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': f'Invalid URL: {str(e)}'
        }))
        sys.exit(1)
    
    # Create scraper and attempt to scrape
    # scraper = WebScraper()
    # result = scraper.scrape_url(url)

    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
    ua=UserAgent()
    hdr = {'User-Agent': ua.random,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
        'Accept-Encoding': 'none',
        'Accept-Language': 'en-US,en;q=0.8',
        'Connection': 'keep-alive'}

    response = requests.get(url, headers=hdr)

    if response.status_code == 200:
        content = response.text
        print(json.dumps({
            'success': True,
            'html': content
        }))
    else:
        print(json.dumps({
            'success': False,
            'error': f'HTTP {response.status_code}: {response.reason}'
        }))
        sys.exit(1)

    # if result['error']:
    #     print(json.dumps({
    #         'success': False,
    #         'error': result['error']
    #     }))
    #     sys.exit(1)
    # else:
    #     print(json.dumps({
    #         'success': True,
    #         'html': result['html']
    #     }))

if __name__ == "__main__":
    main()
