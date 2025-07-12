#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the documentation directories
const CLIENT_DOCS = './client/src/docs';
const SERVER_DOCS = './server/src/docs';

// Ensure all directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Get file modification time
function getFileModTime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.getTime();
  } catch (error) {
    return 0; // File doesn't exist
  }
}

// Copy file with error handling
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    console.log(`✓ Copied: ${source} → ${destination}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to copy ${source} → ${destination}:`, error.message);
    return false;
  }
}

// Get all markdown files from a directory
function getMarkdownFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  
  try {
    return fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(dirPath, file));
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
}

// Find the newest version of a file across all directories
function findNewestFile(fileName) {
  const locations = [
    path.join(CLIENT_DOCS, fileName),
    path.join(SERVER_DOCS, fileName),
  ];
  
  let newestFile = null;
  let newestTime = 0;
  
  for (const location of locations) {
    const modTime = getFileModTime(location);
    if (modTime > newestTime) {
      newestTime = modTime;
      newestFile = location;
    }
  }
  
  return newestFile;
}

// Sync a single file across all directories
function syncFile(fileName) {
  const newestFile = findNewestFile(fileName);
  
  if (!newestFile) {
    console.log(`⚠ No version found for: ${fileName}`);
    return;
  }
  
  console.log(`\n📄 Syncing: ${fileName}`);
  console.log(`   Newest version: ${newestFile}`);
  
  const destinations = [
    path.join(CLIENT_DOCS, fileName),
    path.join(SERVER_DOCS, fileName),
  ].filter(dest => dest !== newestFile); // Don't copy to itself
  
  let successCount = 0;
  for (const destination of destinations) {
    if (copyFile(newestFile, destination)) {
      successCount++;
    }
  }
  
  console.log(`   Synced to ${successCount} locations`);
}

// Get all unique file names across all directories
function getAllFileNames() {
  const clientFiles = getMarkdownFiles(CLIENT_DOCS).map(f => path.basename(f));
  const serverFiles = getMarkdownFiles(SERVER_DOCS).map(f => path.basename(f));
  
  // Combine and remove duplicates
  const allFiles = [...new Set([...clientFiles, ...serverFiles])];
  return allFiles.sort();
}

// Main sync function
function syncDocs() {
  console.log('🔄 Starting documentation sync...\n');
  
  // Ensure all directories exist
  ensureDirectoryExists(CLIENT_DOCS);
  ensureDirectoryExists(SERVER_DOCS);
  
  // Get all unique file names
  const allFiles = getAllFileNames();
  
  if (allFiles.length === 0) {
    console.log('No markdown files found in any documentation directory.');
    return;
  }
  
  console.log(`Found ${allFiles.length} documentation files to sync:`);
  allFiles.forEach(file => console.log(`  - ${file}`));
  
  // Sync each file
  let syncedCount = 0;
  for (const fileName of allFiles) {
    syncFile(fileName);
    syncedCount++;
  }
  
  console.log(`\n✅ Sync complete! Processed ${syncedCount} files.`);
}

// Handle command line arguments
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Documentation Sync Script

Usage: node sync-docs.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be synced without actually copying files
  --verbose      Show detailed information about each file

This script syncs markdown documentation files between:
- client/src/docs/
- server/src/docs/

The newest version of each file will be copied to all other locations.
    `);
    return;
  }
  
  if (args.includes('--dry-run')) {
    console.log('🔍 DRY RUN MODE - No files will be copied\n');
    
    const allFiles = getAllFileNames();
    for (const fileName of allFiles) {
      const newestFile = findNewestFile(fileName);
      if (newestFile) {
        console.log(`${fileName}: ${newestFile} (newest)`);
      } else {
        console.log(`${fileName}: Not found`);
      }
    }
    return;
  }
  
  // Run the sync
  syncDocs();
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { syncDocs, findNewestFile, syncFile }; 