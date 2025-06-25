#!/usr/bin/env python3
"""
Test script for the web scraper
"""

import sys
import os
import json

# Add the current directory to the path so we can import the scraper
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from web_scraper import WebScraper

def test_scraper():
    """Test the web scraper with a sample URL"""
    
    # Test URL (replace with a real job posting URL for testing)
    test_url = "https://httpbin.org/html"
    
    print(f"Testing scraper with URL: {test_url}")
    
    try:
        scraper = WebScraper()
        result = scraper.scrape_url(test_url)
        
        if result['error']:
            print(f"❌ Scraper failed: {result['error']}")
            return False
        else:
            print(f"✅ Scraper successful!")
            print(f"   Content length: {len(result['html'])} characters")
            print(f"   First 200 chars: {result['html'][:200]}...")
            return True
            
    except Exception as e:
        print(f"❌ Test failed with exception: {e}")
        return False

def test_dependencies():
    """Test if all required dependencies are available"""
    print("Testing dependencies...")
    
    try:
        import requests
        print("✅ requests module available")
    except ImportError:
        print("❌ requests module not available")
        return False
    
    try:
        import bs4
        print("✅ beautifulsoup4 module available")
    except ImportError:
        print("❌ beautifulsoup4 module not available")
        return False
    
    try:
        import lxml
        print("✅ lxml module available")
    except ImportError:
        print("❌ lxml module not available")
        return False
    
    return True

if __name__ == "__main__":
    print("=== Python Web Scraper Test ===\n")
    
    # Test dependencies first
    if not test_dependencies():
        print("\n❌ Dependencies test failed. Please install required packages:")
        print("   pip3 install -r requirements.txt")
        sys.exit(1)
    
    print("\n--- Testing scraper functionality ---")
    
    # Test scraper
    if test_scraper():
        print("\n✅ All tests passed! The scraper is ready to use.")
    else:
        print("\n❌ Scraper test failed.")
        sys.exit(1) 