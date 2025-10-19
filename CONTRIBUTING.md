# Contributing to ToolBox

Thank you for your interest in contributing to ToolBox! We welcome contributions from the community and appreciate your help in making this project better.

## ⚠️ IMPORTANT NOTICES

### AI-Generated Content Warning

**Many issues and documentation in this repository may be AI-generated.** Please exercise caution:

- ✓ **Always verify** issue descriptions against the actual codebase
- ✓ **Double-check** that the problem actually exists before starting work
- ✓ **Test thoroughly** - AI-generated content may contain inaccuracies or be outdated
- ✓ **Ask questions** if something doesn't make sense
- ✓ **Review carefully** - don't assume AI-generated issues are 100% accurate

If you find an issue that doesn't match the codebase or is inaccurate, please comment on it to help others avoid wasting time.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## ⚠️ Important Legal Notice

### Contributor License Agreement (CLA)

**By contributing to ToolBox, you automatically agree to our [Contributor License Agreement (CLA)](CLA.md).**

This means:
- ✓ **You retain full copyright** to your contributions
- ✓ You grant ToolBox permission to use your contributions in both **open source and commercial versions**
- ✓ **ONLY the Owner (Rishabh Dubey)** can monetize or commercialize the project
- ✓ You **CANNOT** use the project commercially without permission
- ✓ You certify your contribution is your original work or properly licensed
- ✓ You **waive all claims** to revenue sharing, royalties, or compensation

**No separate signature required** - your pull request, issue, or comment constitutes acceptance of the CLA terms.

### Proprietary License

This project is licensed under a **Proprietary License** (see [LICENSE](LICENSE)). This means:
- ✅ You may view and study the source code
- ✅ You may fork to contribute back to the original project
- ❌ You may NOT redistribute the software
- ❌ You may NOT use it commercially
- ❌ You may NOT create competing products

**Please read both [CLA.md](CLA.md) and [LICENSE](LICENSE) before contributing.**

## Code of Conduct

By participating in this project, you agree to be respectful and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- MongoDB (for database functionality)

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ToolBox.git
   cd ToolBox
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/rishabh3562/ToolBox.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file in the root directory with required environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Fix issues reported in the issue tracker
- **New features**: Add new tools or functionality
- **Documentation**: Improve or add documentation
- **UI/UX improvements**: Enhance the user interface
- **Performance optimizations**: Make the app faster
- **Tests**: Add or improve test coverage
- **Code refactoring**: Improve code quality

## Development Workflow

1. **Sync your fork** with upstream before starting work:
   ```bash
   git checkout main
   git fetch upstream
   git merge upstream/main
   ```

2. **Create a new branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix-name
   ```

3. **Make your changes** following the coding standards

4. **Test your changes**:
   ```bash
   npm run build
   npm run lint
   ```

5. **Commit your changes** using conventional commit messages

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request** on GitHub

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type unless absolutely necessary
- Use meaningful variable and function names

### React & Next.js

- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router conventions
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design for all screen sizes
- Use the provided UI components from `components/ui`

### Code Quality

- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Follow DRY (Don't Repeat Yourself) principle
- Use meaningful names for variables and functions

### File Structure

- Place React components in `components/` or `app/`
- Place utilities in `lib/`
- Place types in `types/`
- Place database models in `lib/db/models/`
- Follow the existing file structure

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

### Examples

```bash
feat(tools): add JSON formatter tool
fix(db): resolve MongoDB connection timeout issue
docs(readme): update installation instructions
style(ui): improve button component styling
refactor(api): simplify error handling logic
```

## Pull Request Process

1. **Ensure your PR**:
   - Follows the coding standards
   - Includes tests if applicable
   - Updates documentation if needed
   - Has a clear description of changes
   - References related issues

2. **Fill out the PR template** completely

3. **Ensure all checks pass**:
   - Build succeeds
   - Linting passes
   - No merge conflicts

4. **Request review** from maintainers

5. **Address review feedback** promptly

6. **Squash commits** if requested

### PR Title Format

Follow the same format as commit messages:
```
feat(scope): add new feature
fix(scope): resolve bug
```

## Reporting Bugs

### Before Submitting a Bug Report

- Check the existing issues to avoid duplicates
- Ensure you're using the latest version
- Try to reproduce the bug with minimal steps

### How to Submit a Bug Report

1. Use the bug report issue template
2. Provide a clear title and description
3. Include steps to reproduce
4. Specify expected vs actual behavior
5. Add screenshots if applicable
6. Include environment details (OS, browser, Node version)

## Suggesting Features

### Before Suggesting a Feature

- Check existing issues and discussions
- Ensure it aligns with project goals
- Consider if it benefits most users

### How to Suggest a Feature

1. Use the feature request issue template
2. Provide a clear title and description
3. Explain the problem it solves
4. Describe your proposed solution
5. Consider alternative solutions
6. Add mockups or examples if helpful

## Questions?

If you have questions:
- Check the [documentation](docs/)
- Open a discussion on GitHub
- Ask in issue comments

## Recognition

All contributors will be recognized in our README.md. Thank you for your contributions!

## License & CLA

By contributing, you agree that:
1. Your contributions will be subject to the project's [Proprietary LICENSE](LICENSE)
2. You automatically accept and agree to the [Contributor License Agreement (CLA)](CLA.md)
3. **ONLY the Owner (Rishabh Dubey)** retains exclusive commercial rights to the project
4. You retain copyright but grant exclusive commercial rights to the Owner
5. You waive all claims to commercialization, royalties, revenue sharing, or compensation
6. You cannot use the project commercially without written permission

For full details, please read:
- [LICENSE](LICENSE) - Proprietary license terms (no redistribution allowed)
- [CLA](CLA.md) - Contributor License Agreement (includes DCO)

## CLA Acceptance

**Your contribution (pull request, issue, comment, etc.) automatically constitutes acceptance of both the LICENSE and CLA terms.** No separate signature is required. A bot will comment on your pull request with CLA information for your reference.

## Important Restrictions

Please note that by contributing:
- ❌ You may NOT redistribute this software
- ❌ You may NOT use it commercially
- ❌ You may NOT create derivative works for distribution
- ✅ You MAY fork to contribute back to this repository
- ✅ You MAY reuse your own contributions in other non-commercial projects
