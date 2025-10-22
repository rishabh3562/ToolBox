# Update Issue Labels Script

This script updates labels on existing GitHub issues without recreating them. It reads the issue content from `ALL.md` and applies appropriate labels based on the content.

## Prerequisites

- `jq` command-line tool installed
- GitHub Personal Access Token with `repo` scope

## Usage

### Option 1: Local Execution

```bash
# Navigate to repository root
cd /path/to/ToolBox

# Set your GitHub token
export GITHUB_TOKEN="your_github_token_here"
export GITHUB_REPOSITORY="rishabh3562/ToolBox"

# Run the script
bash .github/scripts/update-issue-labels.sh
```

### Option 2: With Arguments

```bash
bash .github/scripts/update-issue-labels.sh "rishabh3562/ToolBox" "your_github_token"
```

### Option 3: Using GitHub CLI (Easiest!)

```bash
# If you have GitHub CLI installed and authenticated
export GITHUB_TOKEN=$(gh auth token)
export GITHUB_REPOSITORY="rishabh3562/ToolBox"

bash .github/scripts/update-issue-labels.sh
```

## What It Does

1. **Reads** `.github/hacktoberfest-issues/ALL.md`
2. **Splits** into individual issues (same as workflow)
3. **Finds** existing GitHub issues by matching titles
4. **Determines** correct labels based on content:
   - `testing` - for test-related issues
   - `performance` - for optimization issues
   - `accessibility` - for a11y issues
   - `security` - for auth/security issues
   - `documentation` - for docs issues
   - `api` - for API/SDK issues
   - `mobile` - for mobile app issues
   - `database` - for database/storage issues
   - `enhancement` - for features (default)
   - `devops` - for CI/CD issues
   - `ai` - for AI/ML issues
5. **Adds** `hacktoberfest`, `good first issue`, `help wanted` as appropriate
6. **Updates** labels via GitHub API (doesn't recreate issues!)

## Label Detection Logic

The script uses keyword matching to categorize issues:

| Keywords                     | Label           |
| ---------------------------- | --------------- |
| test, testing                | `testing`       |
| performance, optimization    | `performance`   |
| accessibility, a11y          | `accessibility` |
| security, auth               | `security`      |
| documentation, docs, guide   | `documentation` |
| api, sdk                     | `api`           |
| mobile, ios, android         | `mobile`        |
| database, storage, migration | `database`      |
| plugin, marketplace          | `enhancement`   |
| ci/cd, devops                | `devops`        |
| ai, machine learning         | `ai`            |

Plus special labels:

- `good first issue` - if text contains "good first issue"
- `help wanted` - if text contains "help wanted"
- `hacktoberfest` - added to all issues

## Example Output

```
🔍 Reading issues from .github/hacktoberfest-issues/ALL.md
📦 Repository: rishabh3562/ToolBox

🔍 Looking for issue: Implement User Authentication System
📝 Updating issue #42: Implement User Authentication System
   New labels: ["hacktoberfest","help wanted","security"]
✅ Successfully updated issue #42

🔍 Looking for issue: Build Tool Marketplace
📝 Updating issue #43: Build Tool Marketplace
   New labels: ["hacktoberfest","help wanted","enhancement"]
✅ Successfully updated issue #43

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Summary:
   Updated: 20 issues
   Skipped: 0 issues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Safety Features

- **Non-destructive**: Only updates labels, doesn't modify issue content
- **Idempotent**: Safe to run multiple times
- **Rate limiting**: Includes 1-second delay between API calls
- **Error handling**: Continues on failure, reports at end

## Troubleshooting

### "jq: command not found"

Install jq:

- **macOS**: `brew install jq`
- **Ubuntu/Debian**: `sudo apt-get install jq`
- **Windows (Git Bash)**: Download from https://jqlang.github.io/jq/

### "API rate limit exceeded"

Wait 1 hour or use a different GitHub token.

### "Issue not found"

The script matches issues by exact title. If you've renamed an issue on GitHub, it won't find it. The workflow uses the title from the first `#` line in each issue block in `ALL.md`.

## Creating a GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "ToolBox Label Updater"
4. Select scope: `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)

**Keep this token secure!** Don't commit it to the repository.
