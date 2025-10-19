# Automated Issue Generation System

This system automatically generates GitHub issues from codebase analysis for Hacktoberfest and contributor engagement.

## How It Works

1. **Issue Templates** - Defined in `generate-issues.js` with category, title, body, and difficulty
2. **Auto-Generation** - Script generates `ALL.md` with all issues separated by `---`
3. **Workflow Trigger** - GitHub Actions creates issues automatically
4. **Label Sync** - Labels are synced from `.github/labels.yml`

## Quick Start

### Generate Issues Locally

```bash
node .github/scripts/generate-issues.js
```

This creates `.github/hacktoberfest-issues/ALL.md` with all issues.

### Trigger Workflow

The workflow runs automatically when:
- You push changes to `generate-issues.js`
- You push changes to `ALL.md`
- You manually trigger via Actions tab
- Every Sunday at midnight (scheduled)

## Adding New Issues

Edit `.github/scripts/generate-issues.js` and add to the `ISSUES` array:

```javascript
{
  category: 'feature',  // security, bug, feature, docs, refactor, test, a11y, perf
  title: 'Your issue title',
  difficulty: 'good first issue',  // or 'help wanted'
  body: `
## Problem
Describe the problem...

## Tasks
- [ ] Task 1
- [ ] Task 2

## Acceptance Criteria
- Criteria 1
- Criteria 2
  `
}
```

## Categories

| Category | Emoji | Label | Use For |
|----------|-------|-------|---------|
| security | 🔒 | security | Security vulnerabilities, exposed secrets |
| bug | 🐛 | bug | Code bugs, runtime errors |
| feature | ✨ | enhancement | New features, improvements |
| docs | 📚 | documentation | Documentation, JSDoc, README |
| refactor | ♻️ | refactor | Code cleanup, type safety |
| test | 🧪 | test | Adding tests, test coverage |
| a11y | ♿ | accessibility | ARIA labels, keyboard nav |
| perf | ⚡ | performance | Performance optimizations |

## Workflow Features

- **Duplicate Prevention** - Only creates issues that don't exist
- **Smart Title Extraction** - Handles blank lines in markdown
- **Label Auto-Assignment** - Adds hacktoberfest + category + difficulty labels
- **Error Reporting** - Shows which issues succeeded/failed
- **Weekly Sync** - Scheduled to run every Sunday

## File Structure

```
.github/
├── scripts/
│   ├── generate-issues.js    # Issue generator script
│   └── README.md             # This file
├── hacktoberfest-issues/
│   └── ALL.md                # Generated issues file
├── labels.yml                # Label definitions
└── workflows/
    └── hacktoberfest.yml     # Automation workflow
```

## Tips for Creating Good Issues

1. **Be Specific** - Include file paths and line numbers
2. **Provide Context** - Explain WHY, not just WHAT
3. **Add Examples** - Show code snippets of the problem and solution
4. **Clear Tasks** - Use checklists for step-by-step guidance
5. **Set Expectations** - Define acceptance criteria

## Testing

Before committing, test locally:

```bash
# Generate issues
node .github/scripts/generate-issues.js

# Check the output
cat .github/hacktoberfest-issues/ALL.md

# Verify format (should have 15 issues separated by ---)
grep -c "^---$" .github/hacktoberfest-issues/ALL.md
```

## Troubleshooting

**Issues not created?**
- Check workflow logs in Actions tab
- Verify labels exist in repo (sync-labels job)
- Check for duplicate issue titles

**Wrong number of issues?**
- Count `---` delimiters (should be N-1 for N issues)
- Check for blank lines breaking title extraction

**Labels not showing?**
- Run sync-labels job first
- Verify `.github/labels.yml` has correct format

## Extending the System

You can extend this for other projects:

1. Copy `.github/scripts/generate-issues.js`
2. Update `ISSUES` array with your project's issues
3. Customize categories if needed
4. Run generator and commit ALL.md
5. Set up the workflow

Perfect for:
- Hacktoberfest preparation
- Open source project onboarding
- Issue template management
- Automated contributor guides
