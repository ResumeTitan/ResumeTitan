# Documentation Sync Script

This script automatically synchronizes markdown documentation files between the client, server, and top-level documentation directories.

## What it does

The sync script:
- Finds all `.md` files across three directories:
  - `client/src/docs/`
  - `server/src/docs/`
- Identifies the newest version of each file (based on modification time)
- Copies the newest version to all other locations
- Creates missing directories if they don't exist

## Usage

### Basic sync
```bash
npm run sync-docs
# or
node sync-docs.js
```

### Dry run (see what would be synced without copying)
```bash
npm run sync-docs:dry-run
# or
node sync-docs.js --dry-run
```

### Help
```bash
node sync-docs.js --help
```

## Example Output

```
🔄 Starting documentation sync...

Found 8 documentation files to sync:
  - CoverLetter.md
  - Interview.md
  - Resume.md
  - cover-letter.md
  - getting-started.md
  - interview.md
  - resume.md
  - terms-of-service.md

📄 Syncing: resume.md
   Newest version: client/src/docs/resume.md
✓ Copied: client/src/docs/resume.md → server/src/docs/resume.md
✓ Copied: client/src/docs/resume.md → docs/resume.md
   Synced to 2 locations

✅ Sync complete! Processed 8 files.
```

## When to use

- After updating documentation in any of the three locations
- Before deploying to ensure all documentation is up to date
- When setting up a new environment
- As part of your CI/CD pipeline

## File Naming

The script handles files with different naming conventions (e.g., `resume.md` vs `Resume.md`) and will sync them appropriately. It uses the file modification time to determine which version is newest.

## Error Handling

- If a directory doesn't exist, it will be created
- If a file can't be copied, an error will be shown but the script will continue
- Missing files are reported but don't stop the sync process

## Integration

You can integrate this into your workflow by:

1. **Pre-commit hook**: Run sync before committing documentation changes
2. **CI/CD pipeline**: Ensure docs are synced before deployment
3. **Manual**: Run whenever you update documentation

## Script Location

- Script: `sync-docs.js` (root directory)
- Package scripts: Available via `npm run sync-docs` 