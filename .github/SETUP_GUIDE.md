# Universal Automated Issue Generation for Open Source Repositories

## 🚀 One-Prompt Setup

Copy and paste this entire prompt into Claude Code to make any repository open-source ready with automated issue generation:

---

````
# MISSION: Make this repository open-source ready with automated issue generation

## Your Objectives

1. **Analyze the repository completely**
   - Identify tech stack, languages, frameworks
   - Find real issues in the codebase (security, bugs, missing features, code quality)
   - Understand the project structure and conventions
   - Check for existing CI/CD, linting, testing infrastructure

2. **Design the optimal automation solution**
   - Choose the best approach for THIS specific tech stack
   - Could be GitHub Actions, GitLab CI, pre-commit hooks, scripts, or any other tool
   - Design a solution that fits the existing project conventions
   - Make it maintainable and easy for contributors to understand

3. **Create professional, actionable issues**
   - Use conventional commit format: `type(scope): description`
   - Examples: `feat(auth): add OAuth integration`, `fix(api): handle null responses`
   - Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, security
   - NO emojis in titles or professional documentation
   - Each issue must have:
     * Clear description with file paths and line numbers
     * Impact explanation
     * Actionable task checklist
     * Acceptance criteria (testable outcomes)
     * Code examples where helpful
     * Appropriate difficulty label

4. **Set up label management**
   - Core labels: hacktoberfest, good first issue, help wanted
   - Category labels: security, bug, enhancement, documentation, refactor, test, accessibility, performance
   - Auto-assign labels based on issue content
   - Use platform-appropriate label management (GitHub labels.yml, GitLab, etc.)

5. **Implement the solution**
   - Create all necessary configuration files
   - Write clear documentation in README or CONTRIBUTING.md
   - Set up automation workflows
   - Test that everything works
   - Make it production-ready

## Professional Standards (CRITICAL)

### Issue Titles
✅ CORRECT:
- `feat(auth): add OAuth2 authentication flow`
- `fix(api): handle null pointer in user service`
- `docs(readme): add installation instructions`
- `security(config): move database credentials to environment variables`
- `perf(db): add indexes for user queries`

❌ INCORRECT:
- `Add authentication ✨`
- `🔒 Security: Fix credentials`
- `Improve performance`
- `Update docs`

### Issue Content Quality
MUST INCLUDE:
- **Specific file references**: `src/services/auth.ts:45-67`
- **Clear problem statement**: What's wrong and why it matters
- **Concrete tasks**: `- [ ] Create OAuth service class`, NOT `- [ ] Add auth stuff`
- **Testable acceptance criteria**: "User can login with Google OAuth and session persists"
- **Difficulty assessment**: good first issue (< 2 hours) vs help wanted (> 2 hours)

MUST AVOID:
- Vague descriptions
- Hypothetical issues that don't exist
- Missing context or file references
- Emojis in professional documentation
- Generic tasks without clear actions

### PR Description Template
When issues become PRs, they should follow:

```markdown
## Summary
[2-3 sentences: what changed and why]

## Changes Made
- Change 1 (`file.ts:123`)
- Change 2 (`file.py:456`)

## Testing
- [ ] Test case 1
- [ ] Test case 2

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes

Closes #[issue-number]
````

## Categories to Scan For

Analyze the codebase and create issues for:

### 1. Security (CRITICAL PRIORITY)

- Exposed credentials, API keys, tokens
- Hardcoded secrets in source code
- Missing .gitignore entries for sensitive files
- SQL injection vulnerabilities
- XSS vulnerabilities
- Missing authentication/authorization
- Insecure dependencies
- Missing input validation

### 2. Code Quality

- Type safety issues (any types, missing types)
- Missing error handling
- Code duplication
- Unused imports/variables
- Dead code
- Missing documentation/comments
- Inconsistent naming conventions
- Large functions that need refactoring

### 3. Missing Features

- TODO/FIXME comments in code
- Partially implemented features
- Missing CRUD operations
- Incomplete API endpoints
- Missing UI components
- Feature requests from comments

### 4. Performance

- Missing database indexes
- N+1 query problems
- Unoptimized algorithms
- Missing caching
- Large bundle sizes
- Memory leaks
- Synchronous operations that should be async

### 5. Testing

- Missing unit tests
- Missing integration tests
- Missing E2E tests
- Low code coverage areas
- Missing error case tests
- Untested edge cases

### 6. Documentation

- Missing README sections
- No setup instructions
- Undocumented API endpoints
- Missing code comments
- No contribution guidelines
- Missing architecture documentation
- Outdated documentation

### 7. Accessibility

- Missing ARIA labels
- Poor keyboard navigation
- Missing alt text on images
- Low contrast ratios
- Missing focus indicators
- Screen reader incompatibility

### 8. Developer Experience

- Missing linting setup
- No pre-commit hooks
- Missing CI/CD pipeline
- No automated testing
- Missing Docker configuration
- Poor local development setup

## Implementation Approach

**YOU DECIDE THE BEST APPROACH** based on:

- What tech stack is being used
- What CI/CD is already in place
- What the project conventions are
- What will be easiest to maintain

### Possible Approaches:

**For Node.js/JavaScript/TypeScript:**

- GitHub Actions with Node script
- npm/yarn scripts
- ESLint plugins for issue detection

**For Python:**

- GitHub Actions with Python script
- pre-commit hooks
- pylint/flake8 integration

**For Go:**

- GitHub Actions with Go binary
- Makefile targets
- golangci-lint integration

**For Rust:**

- GitHub Actions with Rust binary
- Cargo scripts
- clippy integration

**For Any Language:**

- Shell scripts with GitHub API
- GitHub GraphQL API
- GitLab CI
- Custom CI/CD platform integration
- Manual issue templates that are easier to fill out

## Success Criteria

When you're done, the repository should have:

✅ **10-30 high-quality issues** ready for contributors
✅ **Proper labels** set up and auto-assigned
✅ **Automation working** (if you implement it)
✅ **Clear documentation** for maintainers
✅ **Professional formatting** throughout
✅ **Real, actionable issues** (not hypothetical)
✅ **Difficulty distribution**: ~60% good first issue, ~40% help wanted
✅ **Category distribution**: Security > Bugs > Features > Quality > Docs

## Project Context

**Repository URL**: [if applicable]
**Tech Stack**: [I'll provide, or you detect it]
**Primary Language**: [auto-detect]
**Framework**: [auto-detect]
**Current Issue Count**: [check]
**Has CI/CD**: [check]
**Has Tests**: [check]
**Priority Areas**: [I'll specify if needed, otherwise use your judgment]

## Your Action Plan

1. **Scan the entire codebase**
   - Use Glob to find all relevant files
   - Use Grep to search for issues
   - Read key files to understand architecture
   - Analyze dependencies and configuration

2. **Design your approach**
   - Decide on automation strategy
   - Plan file structure
   - Design workflow/script logic

3. **Create issues**
   - Generate issues based on real findings
   - Use proper conventional commit format
   - Include all required sections
   - Assign appropriate labels

4. **Implement automation**
   - Create workflow/scripts
   - Set up label management
   - Add documentation
   - Test the setup

5. **Document everything**
   - Update README if needed
   - Create CONTRIBUTING.md if missing
   - Document the issue generation process
   - Provide maintenance instructions

## Important Constraints

- **NO EMOJIS** in issue titles, PR templates, or professional docs
- **USE CONVENTIONAL COMMITS** format religiously
- **BE SPECIFIC** - every issue should reference actual file locations
- **BE ACTIONABLE** - contributors should know exactly what to do
- **BE ACCURATE** - only create issues for problems that actually exist
- **BE MAINTAINABLE** - the solution should be easy to update and maintain

## Examples of Great Issues

### Example 1: Security Issue

````
Title: security(auth): move JWT secret to environment variable

## Description
JWT secret is hardcoded in `src/config/auth.ts:12` exposing the authentication
system to potential attacks. Anyone with repository access can see the secret
and forge tokens.

**Affected file**: `src/config/auth.ts:12`

## Impact
- Authentication system is compromised
- Attackers can generate valid JWT tokens
- All user sessions are at risk

## Tasks
- [ ] Create `.env.example` with `JWT_SECRET=your_secret_here`
- [ ] Update `src/config/auth.ts` to read from `process.env.JWT_SECRET`
- [ ] Add validation to throw error if JWT_SECRET is not set
- [ ] Update README.md with environment variable setup instructions
- [ ] Rotate JWT secret after deployment

## Acceptance Criteria
- No secrets in source code
- App fails gracefully if JWT_SECRET is missing
- Documentation clearly explains setup

## Technical Details
Use environment variables following Next.js/Express conventions:
```js
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
````

```

### Example 2: Feature Issue
```

Title: feat(api): add pagination to user list endpoint

## Description

GET /api/users endpoint returns all users without pagination, causing performance
issues and timeouts with large datasets (currently 50k+ users).

**Affected file**: `src/routes/users.ts:23-35`

## Impact

- API timeouts with large datasets
- Poor user experience
- Excessive database load
- High bandwidth usage

## Tasks

- [ ] Add `page` and `limit` query parameters to GET /api/users
- [ ] Update database query to use LIMIT and OFFSET
- [ ] Return pagination metadata (total, page, pageSize, totalPages)
- [ ] Update API documentation
- [ ] Add tests for pagination edge cases

## Acceptance Criteria

- Endpoint supports `?page=1&limit=20` parameters
- Returns paginated results with metadata
- Default limit is 20, max is 100
- Handles edge cases (page out of range, invalid params)

## Technical Details

Response format:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1523,
    "totalPages": 77
  }
}
```

```

## Begin Analysis

Start by exploring the repository structure and identifying the tech stack.
Then design and implement the optimal solution for THIS specific codebase.

Think creatively - if there's a better approach than what I've suggested, use it.
Your goal is to make this repository as contributor-friendly as possible while
maintaining professional standards.

Show your work as you go:
1. Share what you discover about the codebase
2. Explain your chosen approach and why
3. Create the issues
4. Implement the automation
5. Summarize what you built
```

---

## Quick Reference: Conventional Commit Types

| Type       | Use Case                 | Example                                |
| ---------- | ------------------------ | -------------------------------------- |
| `feat`     | New features             | `feat(auth): add OAuth login`          |
| `fix`      | Bug fixes                | `fix(api): handle null responses`      |
| `docs`     | Documentation only       | `docs(readme): add setup guide`        |
| `style`    | Code style/formatting    | `style(lint): fix ESLint warnings`     |
| `refactor` | Code restructuring       | `refactor(db): extract query builder`  |
| `perf`     | Performance improvements | `perf(search): add database indexes`   |
| `test`     | Adding/updating tests    | `test(auth): add login unit tests`     |
| `build`    | Build system changes     | `build(webpack): optimize bundle size` |
| `ci`       | CI/CD changes            | `ci(actions): add test workflow`       |
| `chore`    | Maintenance tasks        | `chore(deps): update dependencies`     |
| `security` | Security fixes           | `security(env): remove exposed keys`   |

## What Gets Created

After running this prompt, you'll have:

- ✅ **10-30 professional issues** specific to your codebase
- ✅ **Automated issue generation** (if appropriate for your tech stack)
- ✅ **Label management system** configured
- ✅ **PR templates** for contributors
- ✅ **Documentation** for maintainers
- ✅ **Contributor guidelines** (if missing)
- ✅ **Hacktoberfest-ready** repository

## Different Tech Stack Examples

### Example: Node.js/TypeScript Project

Claude might create:

- `.github/workflows/issues.yml` (GitHub Actions)
- `.github/scripts/generate-issues.js`
- `.github/labels.yml`
- `.github/ISSUE_TEMPLATE/` directory
- Updated `CONTRIBUTING.md`

### Example: Python Project

Claude might create:

- `.github/workflows/issues.yml` (GitHub Actions)
- `scripts/generate_issues.py`
- `.github/labels.yaml`
- `pyproject.toml` updates for tooling
- Updated `CONTRIBUTING.md`

### Example: Go Project

Claude might create:

- `.github/workflows/issues.yml`
- `cmd/issue-generator/main.go`
- Makefile targets
- `.github/labels.yml`
- Updated `README.md`

### Example: Mixed Language Project

Claude might create:

- Shell script automation (works everywhere)
- Language-specific linters integrated
- Comprehensive issue templates
- Manual process documentation

## Maintenance

Once set up, you can:

1. **Add more issues**: Edit the script/template and re-run
2. **Update labels**: Modify labels.yml and sync
3. **Regenerate**: Run the workflow/script again
4. **Customize**: Adjust categories and priorities

## Why This Approach Works

✅ **Language agnostic** - works for any tech stack
✅ **Flexible** - Claude chooses the best approach
✅ **Professional** - follows industry standards
✅ **Automated** - minimal manual work
✅ **Maintainable** - easy to update and extend
✅ **Scalable** - handles projects of any size
✅ **Contributor-friendly** - clear, actionable issues

## Tips for Best Results

1. **Let Claude analyze first** - don't force a specific implementation
2. **Review generated issues** - Claude will show them before creating
3. **Provide context** - mention priority areas if you have them
4. **Trust the process** - Claude will design the optimal solution
5. **Iterate if needed** - refine based on first results

## Common Use Cases

### "Make my personal project open source"

Just paste the prompt - Claude will handle everything

### "Prepare for Hacktoberfest"

Paste the prompt, mention it's for Hacktoberfest

### "Create contributor-friendly issues"

Paste the prompt, mention you want beginner-friendly issues

### "Automate issue management"

Paste the prompt, mention automation is priority

### "Clean up technical debt"

Paste the prompt, mention focus on refactoring and quality

---

**Last Updated**: 2025-10-17
**Works With**: Any programming language, any repository
**Time to Setup**: 2-5 minutes (just paste the prompt)
**Maintained By**: Claude Code automation
