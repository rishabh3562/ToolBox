#!/usr/bin/env node

/**
 * Automated Issue Generator for ToolBox
 * Generates GitHub issues from analysis of the codebase
 */

const fs = require("fs");
const path = require("path");

// Issue categories
const CATEGORIES = {
  security: { prefix: "security", label: "security" },
  bug: { prefix: "fix", label: "bug" },
  feature: { prefix: "feat", label: "enhancement" },
  docs: { prefix: "docs", label: "documentation" },
  refactor: { prefix: "refactor", label: "refactor" },
  test: { prefix: "test", label: "test" },
  a11y: { prefix: "a11y", label: "accessibility" },
  perf: { prefix: "perf", label: "performance" },
};

// Issue templates - Add more issues here to auto-generate
const ISSUES = [
  // SECURITY
  {
    category: "security",
    title: "Move MongoDB connection string to environment variables",
    difficulty: "good first issue",
    body: `## Description

The MongoDB connection string containing username and password is hardcoded directly in the source code. This is a critical security vulnerability as it exposes database credentials in the repository history and to anyone with read access.

**Affected file:** \`lib/db/connection.ts\` (lines 3-4)

**Current implementation:**
\`\`\`typescript
const MONGODB_URI =
  "***REMOVED***";
\`\`\`

## Impact

- Database credentials are publicly visible in the repository
- Compromised credentials allow unauthorized database access
- Repository history retains the exposed credentials
- Production database is at risk of unauthorized modifications

## Implementation Tasks

- [ ] Update \`lib/db/connection.ts\` to read connection string from \`process.env.MONGODB_URI\`
- [ ] Add validation to throw a descriptive error if the environment variable is not set
- [ ] Create \`.env.example\` with placeholder for \`MONGODB_URI\`
- [ ] Update project documentation (README.md) with environment variable setup instructions
- [ ] Rotate the exposed database credentials immediately after merging this fix

## Technical Requirements

The solution should:
1. Use environment variables for all sensitive configuration
2. Provide clear error messages when required variables are missing
3. Follow Next.js best practices for environment variable usage
4. Maintain backward compatibility with existing database schema

## Acceptance Criteria

- MongoDB connection string is read from environment variable
- Application fails gracefully with helpful error message if MONGODB_URI is not configured
- No hardcoded credentials remain in source code or git history
- Documentation clearly describes environment setup process`,
  },

  {
    category: "security",
    title: "Prevent .env files from being tracked in version control",
    difficulty: "good first issue",
    body: `## Description

The \`.env\` file containing sensitive API keys and configuration is currently tracked in version control. This file should never be committed as it exposes secrets to anyone with repository access.

**Affected file:** \`.env\` (line 1 contains exposed API key)

## Impact

- API keys are publicly visible in repository
- Exposed keys can be misused or need rotation
- Violates security best practices for secret management
- New contributors may accidentally commit additional secrets

## Implementation Tasks

- [ ] Add \`.env\` to \`.gitignore\` file
- [ ] Create \`.env.example\` file with placeholder values for all required environment variables
- [ ] Document all environment variables in the \`.env.example\` file
- [ ] Update README.md with instructions for environment setup
- [ ] Remove \`.env\` from git history using \`git rm --cached .env\`
- [ ] Rotate any exposed API keys after implementing this fix

## Example .env.example Structure

\`\`\`env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/toolbox

# API Keys
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

## Technical Requirements

1. Ensure \`.gitignore\` includes \`.env\` but not \`.env.example\`
2. Document each environment variable's purpose in \`.env.example\`
3. Provide example values that are safe for local development
4. Include setup instructions in project README

## Acceptance Criteria

- \`.env\` file is not tracked by git
- \`.env.example\` exists with all required variables documented
- README includes clear setup instructions
- No sensitive data remains in git history`,
  },

  // FEATURES
  {
    category: "feature",
    title: "Implement dynamic category creation in Snippet Library",
    difficulty: "help wanted",
    body: `## Feature Request
Add ability to dynamically create and manage categories in the Snippet Library.

**File:** \`app/tools/snippet-library/page.tsx:142-144\`

Currently the category tree has an \`onAdd\` handler but it's not implemented.

## Tasks
- [ ] Create a dialog/modal for adding new categories
- [ ] Add category name input and parent selection
- [ ] Implement \`createCategory\` service method
- [ ] Update UI to show new categories immediately
- [ ] Add category edit/delete functionality

## Acceptance Criteria
- Users can add nested categories
- Categories persist to database
- UI updates without page reload`,
  },

  {
    category: "feature",
    title: "Create API routes for database operations",
    difficulty: "help wanted",
    body: `## Problem
All database operations happen client-side via services. This is a security risk.

## Tasks
Create API routes in \`app/api/\`:
- [ ] \`/api/templates\` (GET, POST, PUT, DELETE)
- [ ] \`/api/snippets\` (GET, POST, PUT, DELETE)
- [ ] \`/api/profiles\` (GET, POST, PUT, DELETE)
- [ ] \`/api/schemas\` (GET, POST, PUT, DELETE)
- [ ] \`/api/variables\` (GET, POST, PUT, DELETE)

Each route should:
- Validate request data using Zod schemas
- Handle errors gracefully
- Return proper HTTP status codes
- Support pagination and filtering

## Acceptance Criteria
- All DB operations go through API routes
- Client-side services call API routes instead of direct DB access
- Proper error handling and validation`,
  },

  // CODE QUALITY
  {
    category: "refactor",
    title: "Remove any types and improve type safety",
    difficulty: "good first issue",
    body: `## Problem
Multiple files use \`any\` type which bypasses TypeScript safety.

**Files:**
- \`lib/db/connection.ts:15,19\`
- \`lib/db/services/profileService.ts:69\`
- \`lib/db/services/snippetService.ts:69\`

## Tasks
- [ ] Replace \`(globalThis as any).mongoose\` with proper typing
- [ ] Create proper types for search filters
- [ ] Define TypeScript interfaces for all service methods
- [ ] Run \`tsc --noImplicitAny\` to find remaining issues

## Acceptance Criteria
- Zero \`any\` types in codebase
- All functions have proper type signatures`,
  },

  {
    category: "bug",
    title: "Remove hardcoded personal data from default variables",
    difficulty: "good first issue",
    body: `## Problem
Default variables contain hardcoded personal information in \`lib/db/services/variableService.ts:60-115\`

\`\`\`typescript
key: "your_name",
value: "Rishabh Dubey",  // Should be placeholder
key: "portfolio_url",
value: "https://dubeyrishabh108.vercel.app/home",  // Personal URL
\`\`\`

## Tasks
- [ ] Replace personal data with generic placeholders
- [ ] Use "Your Name", "your-email@example.com", etc.
- [ ] Keep the structure but remove actual personal info

## Acceptance Criteria
- No personal information in default variables
- Placeholders are clear and instructive`,
  },

  // TESTING
  {
    category: "test",
    title: "Add unit tests for database services",
    difficulty: "help wanted",
    body: `## Problem
No tests exist for database services.

## Tasks
- [ ] Set up Jest + ts-jest
- [ ] Install mongodb-memory-server for test DB
- [ ] Create tests for \`TemplateService\`
  - Test CRUD operations
  - Test search functionality
  - Test error cases
- [ ] Add test scripts to package.json

## Example Test Structure
\`\`\`typescript
describe('TemplateService', () => {
  beforeAll(async () => {
    // Setup test DB
  });

  it('should create a template', async () => {
    // Test implementation
  });

  it('should search templates', async () => {
    // Test implementation
  });
});
\`\`\`

## Acceptance Criteria
- \`npm test\` runs and passes
- At least 80% code coverage for services`,
  },

  // DOCUMENTATION
  {
    category: "docs",
    title: "Add JSDoc comments to all service methods",
    difficulty: "good first issue",
    body: `## Problem
Service methods lack documentation making the codebase hard to understand.

**Files:** All files in \`lib/db/services/\`

## Tasks
Add JSDoc to all service methods:
- [ ] \`templateService.ts\`
- [ ] \`snippetService.ts\`
- [ ] \`profileService.ts\`
- [ ] \`schemaService.ts\`
- [ ] \`variableService.ts\`

## Example
\`\`\`typescript
/**
 * Creates a new template in the database
 * @param templateData - Template data without ID
 * @returns Promise resolving to created template with ID
 * @throws Error if template creation fails
 */
static async createTemplate(templateData: Omit<ITemplate, 'id'>): Promise<ITemplate> {
  // Implementation
}
\`\`\`

## Acceptance Criteria
- All public methods have JSDoc comments
- Parameters, return values, and exceptions documented`,
  },

  // ACCESSIBILITY
  {
    category: "a11y",
    title: "Add ARIA labels to icon-only buttons",
    difficulty: "good first issue",
    body: `## Problem
Icon-only buttons lack ARIA labels making them inaccessible to screen readers.

**Files:**
- \`app/tools/markdown-editor/page.tsx:66-69\`
- \`components/profiles/profile-card.tsx\`
- Other components with icon buttons

## Tasks
- [ ] Add \`aria-label\` to all icon-only buttons
- [ ] Ensure button purpose is clear from label
- [ ] Test with screen reader

## Example
\`\`\`typescript
<Button
  variant="outline"
  size="sm"
  onClick={copyToClipboard}
  aria-label="Copy markdown to clipboard"
>
  <Copy className="h-4 w-4" />
</Button>
\`\`\`

## Acceptance Criteria
- All icon buttons have descriptive aria-labels
- Screen reader announces button purpose correctly`,
  },

  {
    category: "a11y",
    title: "Add keyboard navigation to interactive card components",
    difficulty: "good first issue",
    body: `## Problem
Interactive cards use \`onClick\` on divs without keyboard support.

**File:** \`components/profiles/profile-card.tsx\`

## Tasks
- [ ] Replace clickable divs with buttons or add proper keyboard handlers
- [ ] Add \`onKeyDown\` handler for Enter and Space keys
- [ ] Ensure \`tabIndex={0}\` for keyboard focus
- [ ] Add focus visible styles

## Example
\`\`\`typescript
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  className="card focus:ring-2 focus:ring-primary"
>
  {/* Card content */}
</div>
\`\`\`

## Acceptance Criteria
- Cards are keyboard accessible (Tab to focus, Enter to activate)
- Focus indicators are visible`,
  },

  // PERFORMANCE
  {
    category: "perf",
    title: "Add database indexes for search queries",
    difficulty: "help wanted",
    body: `## Problem
Search queries use regex without indexes, causing slow searches.

**Files:** All models in \`lib/db/models/\`

## Tasks
- [ ] Add text indexes to searchable fields
- [ ] Update search queries to use \`$text\` search
- [ ] Add compound indexes for common queries
- [ ] Test performance improvement

## Example
\`\`\`typescript
// In model schema
schemaDefinition.index({ name: 'text', description: 'text' });

// In service
Model.find({ $text: { $search: query } })
\`\`\`

## Acceptance Criteria
- Search performance improved by >50%
- Indexes added to all searchable fields`,
  },

  // MORE FEATURES
  {
    category: "feature",
    title: "Add error boundary component for better error handling",
    difficulty: "good first issue",
    body: `## Problem
No React Error Boundary exists to catch component errors gracefully.

## Tasks
- [ ] Create \`components/error-boundary.tsx\`
- [ ] Implement error boundary with fallback UI
- [ ] Add error reporting (console or service)
- [ ] Wrap app in error boundary at \`app/layout.tsx\`

## Example
\`\`\`typescript
'use client';

import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <button onClick={() => this.setState({ hasError: false })}>
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
\`\`\`

## Acceptance Criteria
- App shows friendly error message instead of crashing
- User can recover from errors`,
  },

  {
    category: "feature",
    title: "Implement dynamic tag filtering in Snippet Library",
    difficulty: "good first issue",
    body: `## Problem
Tags are hardcoded in \`app/tools/snippet-library/page.tsx:149-157\`

## Tasks
- [ ] Extract tags from snippets dynamically
- [ ] Add tag input to snippet form
- [ ] Filter snippets by selected tags
- [ ] Show tag count for each tag

## Acceptance Criteria
- Tags are generated from snippet data
- Users can filter by multiple tags
- Tag counts are accurate`,
  },

  {
    category: "feature",
    title: "Add confirmation dialog for destructive actions",
    difficulty: "good first issue",
    body: `## Problem
Delete operations happen without confirmation.

**Files:**
- \`components/profiles/profile-card.tsx\`
- Other delete buttons

## Tasks
- [ ] Create reusable confirmation dialog component
- [ ] Add to all delete operations
- [ ] Include item name in confirmation message
- [ ] Add "I understand" checkbox for critical actions

## Acceptance Criteria
- All delete actions require confirmation
- User sees what they're deleting`,
  },

  // CI/CD
  {
    category: "feature",
    title: "Add GitHub Actions workflow for build and lint",
    difficulty: "good first issue",
    body: `## Problem
No CI/CD pipeline to verify PRs.

## Tasks
- [ ] Create \`.github/workflows/ci.yml\`
- [ ] Run on push and pull_request
- [ ] Steps: checkout, setup Node, install, build, lint
- [ ] Fail PR if build or lint fails

## Example Workflow
\`\`\`yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run lint
\`\`\`

## Acceptance Criteria
- Workflow runs on all PRs
- PRs blocked if build/lint fails`,
  },
];

// Generate markdown file
function generateMarkdown() {
  let markdown = "";

  ISSUES.forEach((issue, index) => {
    const category = CATEGORIES[issue.category];

    // Add delimiter before each issue except the first
    if (index > 0) {
      markdown += "\n---\n\n";
    }

    // Title - no emoji, standard syntax
    markdown += `# ${issue.title}\n\n`;

    // Body
    markdown += issue.body + "\n";
  });

  return markdown;
}

// Main execution
const outputPath = path.join(__dirname, "..", "hacktoberfest-issues", "ALL.md");
const markdown = generateMarkdown();

fs.writeFileSync(outputPath, markdown, "utf8");
console.log(`✅ Generated ${ISSUES.length} issues in ${outputPath}`);
console.log(`\nRun the workflow to create GitHub issues!`);
