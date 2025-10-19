# Running on Windows

## Option 1: Using Git Bash (Recommended)

If you installed Git for Windows, you already have Git Bash:

1. **Open Git Bash** (right-click in Windows Explorer → "Git Bash Here")

2. **Navigate to your repository**:
   ```bash
   cd /d/rishabh/Github/ToolBox
   ```

3. **Install jq** (if not already installed):
   ```bash
   # Download jq for Windows
   curl -L -o jq.exe https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-win64.exe

   # Move to a directory in PATH or current directory
   mv jq.exe .github/scripts/

   # Add to PATH for this session
   export PATH="$PATH:$(pwd)/.github/scripts"
   ```

4. **Set environment variables**:
   ```bash
   # If you have GitHub CLI installed
   export GITHUB_TOKEN=$(gh auth token)
   export GITHUB_REPOSITORY="rishabh3562/ToolBox"

   # OR use your personal access token
   export GITHUB_TOKEN="ghp_your_token_here"
   export GITHUB_REPOSITORY="rishabh3562/ToolBox"
   ```

5. **Run the script**:
   ```bash
   bash .github/scripts/update-issue-labels.sh
   ```

## Option 2: Using PowerShell + WSL

If you have WSL (Windows Subsystem for Linux):

1. **Open PowerShell** and start WSL:
   ```powershell
   wsl
   ```

2. **Navigate to repository** (Windows drives are at /mnt/):
   ```bash
   cd /mnt/d/rishabh/Github/ToolBox
   ```

3. **Install jq** (if needed):
   ```bash
   sudo apt-get update
   sudo apt-get install jq
   ```

4. **Run the script**:
   ```bash
   export GITHUB_TOKEN="ghp_your_token_here"
   export GITHUB_REPOSITORY="rishabh3562/ToolBox"
   bash .github/scripts/update-issue-labels.sh
   ```

## Option 3: Using GitHub Actions (Easiest - No Local Setup!)

Create a manual workflow to run the script:

1. **Create** `.github/workflows/update-labels.yml`:
   ```yaml
   name: Update Issue Labels

   on:
     workflow_dispatch:  # Manual trigger only

   jobs:
     update-labels:
       runs-on: ubuntu-latest
       permissions:
         issues: write
         contents: read
       steps:
         - uses: actions/checkout@v4

         - name: Install jq
           run: sudo apt-get install -y jq

         - name: Update labels
           env:
             GITHUB_REPOSITORY: ${{ github.repository }}
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
           run: bash .github/scripts/update-issue-labels.sh
   ```

2. **Go to GitHub** → Actions → "Update Issue Labels" → "Run workflow"

3. **Done!** Labels updated without any local setup.

## Getting a GitHub Token

1. Go to: https://github.com/settings/tokens/new
2. Name: "ToolBox Label Updater"
3. Expiration: 7 days (or your preference)
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token (starts with `ghp_`)

## Checking if jq is Installed

```bash
# In Git Bash or WSL
jq --version

# Should output something like: jq-1.7.1
```

If not installed, follow Option 1 Step 3 above.

## Troubleshooting

### "bash: jq: command not found"
- Follow the jq installation steps in Option 1 or 2

### "Permission denied"
```bash
chmod +x .github/scripts/update-issue-labels.sh
```

### "curl: command not found" in Git Bash
- Git Bash should have curl. Try reinstalling Git for Windows

### Script can't find issues
- Make sure issues were already created by the Hacktoberfest workflow
- Check that `.github/hacktoberfest-issues/ALL.md` exists

### Rate limit errors
- Wait 1 hour and try again
- Or use a fresh GitHub token
