# Quick Start: Update Labels on Existing Issues

## 🚀 Fastest Method (using GitHub CLI)

If you have GitHub CLI installed:

```bash
# From repository root
cd D:\rishabh\Github\ToolBox

# Run the script (gh CLI automatically provides auth)
gh auth token | GITHUB_TOKEN=$(cat) GITHUB_REPOSITORY="rishabh3562/ToolBox" bash .github/scripts/update-issue-labels.sh
```

Or even simpler:

```bash
export GITHUB_TOKEN=$(gh auth token)
export GITHUB_REPOSITORY="rishabh3562/ToolBox"
bash .github/scripts/update-issue-labels.sh
```

## 📋 What This Will Do

✅ Find all 20 issues you created from the Hacktoberfest workflow
✅ Update their labels based on content (security, enhancement, api, etc.)
✅ Add "good first issue" and "help wanted" where appropriate
✅ Keep "hacktoberfest" label on all issues
❌ Will NOT recreate or delete any issues
❌ Will NOT trigger the workflow again

## 🎯 Expected Results

Your issues will have these labels after running:

| Issue Title                              | Labels                                                              |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Implement User Authentication System     | `hacktoberfest`, `help wanted`, `security`                          |
| Migrate to User-Scoped Data Storage      | `hacktoberfest`, `help wanted`, `database`                          |
| Build Community Tool Marketplace         | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Implement Tool Plugin Architecture       | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Add Real-time Collaboration Features     | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Implement Advanced Search & Discovery    | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Build Developer API & SDK                | `hacktoberfest`, `help wanted`, `api`                               |
| Implement Analytics & Insights Dashboard | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Add Progressive Web App (PWA) Support    | `hacktoberfest`, `good first issue`, `help wanted`, `enhancement`   |
| Implement Import/Export & Backup System  | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Build Comprehensive Testing Suite        | `hacktoberfest`, `help wanted`, `testing`                           |
| Implement Performance Optimization       | `hacktoberfest`, `help wanted`, `performance`                       |
| Add Accessibility Improvements           | `hacktoberfest`, `good first issue`, `help wanted`, `accessibility` |
| Implement Notification System            | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Create Mobile App                        | `hacktoberfest`, `help wanted`, `mobile`                            |
| Implement AI-Powered Features            | `hacktoberfest`, `help wanted`, `ai`                                |
| Build Admin Dashboard & Moderation Tools | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Implement Social Features & Community    | `hacktoberfest`, `help wanted`, `enhancement`                       |
| Implement CI/CD Pipeline                 | `hacktoberfest`, `help wanted`, `devops`                            |
| Create Comprehensive Documentation Site  | `hacktoberfest`, `good first issue`, `help wanted`, `documentation` |

## ⏱️ How Long Will It Take?

- Script runs in ~30-40 seconds (20 issues × 1-2 seconds each)
- Includes rate limiting to be nice to GitHub API
- Shows progress as it updates each issue

## 🔒 Security Note

The script only needs `repo` scope on your GitHub token. It will:

- ✅ Read existing issues
- ✅ Update labels
- ❌ Won't modify issue titles or descriptions
- ❌ Won't close or delete issues
- ❌ Won't create new issues
