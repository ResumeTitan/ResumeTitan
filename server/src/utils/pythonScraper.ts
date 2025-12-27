import { spawn } from 'child_process';
import path from 'path';

/**
 * @function callPythonScraper
 * @description Call the Python web scraper script to fetch HTML from a URL
 * @param {string} url - The URL to scrape
 * @returns {Promise<{success: boolean, html?: string, error?: string}>}
 */
export const callPythonScraper = async (url: string): Promise<{ success: boolean; html?: string; error?: string }> => {
    return new Promise(resolve => {
        // Path to the Python script
        const scriptPath = path.join(__dirname, '../../scraper/web_scraper.py');

        // Spawn Python process
        const pythonProcess = spawn('python3', [scriptPath, url], {
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 60000, // 60 second timeout
        });

        let stdout = '';
        let stderr = '';

        // Collect stdout data
        pythonProcess.stdout.on('data', data => {
            stdout += data.toString();
        });

        // Collect stderr data
        pythonProcess.stderr.on('data', data => {
            stderr += data.toString();
        });

        // Handle process completion
        pythonProcess.on('close', code => {
            if (code === 0) {
                try {
                    const result = JSON.parse(stdout);
                    resolve(result);
                } catch (error) {
                    resolve({
                        success: false,
                        error: `Failed to parse Python output: ${error}`,
                    });
                }
            } else {
                resolve({
                    success: false,
                    error: `Python process failed with code ${code}. Stderr: ${stderr}`,
                });
            }
        });

        // Handle process errors
        pythonProcess.on('error', error => {
            resolve({
                success: false,
                error: `Failed to start Python process: ${error.message}`,
            });
        });

        // Handle timeout
        pythonProcess.on('timeout', () => {
            pythonProcess.kill();
            resolve({
                success: false,
                error: 'Python scraper timed out after 60 seconds',
            });
        });
    });
};

/**
 * @function isPythonAvailable
 * @description Check if Python 3 is available on the system
 * @returns {Promise<boolean>}
 */
export const isPythonAvailable = async (): Promise<boolean> => {
    return new Promise(resolve => {
        const pythonProcess = spawn('python3', ['--version'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 10000,
        });

        pythonProcess.on('close', code => {
            resolve(code === 0);
        });

        pythonProcess.on('error', () => {
            resolve(false);
        });

        pythonProcess.on('timeout', () => {
            pythonProcess.kill();
            resolve(false);
        });
    });
};
