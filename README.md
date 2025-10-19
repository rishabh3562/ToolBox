# ToolBox 🧰

A comprehensive collection of professional developer tools and utilities built with Next.js 14, TypeScript, and modern web technologies. Discover, share, and access essential tools that streamline your daily workflow.

![ToolBox Banner](https://github.com/user-attachments/assets/19845877-517c-482c-9d25-c06134a81f95)

## 🌟 Overview

ToolBox is an open-source platform where developers can discover and share tools that enhance productivity. Whether you're looking for development utilities, design tools, or productivity enhancers, ToolBox provides a curated collection of resources for your daily needs.

## ✨ Features

- **Lightning Fast** - All tools run directly in your browser with optimized performance
- **Privacy First** - Your data stays local, no server-side processing required
- **Modern UI** - Beautiful, responsive interface built with Radix UI and Tailwind CSS
- **Dark Mode** - Full dark mode support for comfortable extended use
- **MongoDB Integration** - Store and manage your templates, snippets, and profiles
- **Type Safe** - Built with TypeScript for reliability and superior developer experience
- **Community Driven** - Add your favorite tools and discover new ones from the community

## 🛠️ Built-in Tools

### Template Manager
Create, organize, and manage reusable code templates with variable support. Perfect for boilerplate code, configuration files, and documentation templates.

![Template Manager](https://github.com/user-attachments/assets/ec633bab-d9e5-453f-9740-5ca5f91578be)

### Markdown Editor
Rich markdown editing experience with live preview, syntax highlighting, and export capabilities.

![Markdown Editor](https://github.com/user-attachments/assets/8d39f8f0-e0cb-4096-a9a9-d416838c12a9)

### Schema Generator
Generate database schemas, TypeScript types, and validation schemas with AI assistance.

![Schema Generator](https://github.com/user-attachments/assets/51cb3b68-0f24-4206-a910-45f19f6a5a80)

### Snippet Library
Save and organize code snippets with syntax highlighting for quick reference and reuse.

### Profile Tracker
Track and manage your development profiles and configurations across different platforms and environments.

### GitHub Helper
Streamline your GitHub workflow with helpful utilities for repositories, issues, and pull requests.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn or pnpm
- MongoDB (optional, for database features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rishabh3562/ToolBox.git
cd ToolBox
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your actual values:
# - MONGODB_URI: Your MongoDB connection string (optional)
# - NEXT_PUBLIC_GEMINI_API_KEY: Your Gemini API key from https://makersuite.google.com/app/apikey (optional)
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build & Deploy

To build the application for production:

```bash
npm run build
npm run start
```

## 🧪 Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Database:** MongoDB with Mongoose
- **Code Editor:** Monaco Editor
- **Markdown:** react-markdown with remark-gfm
- **Forms:** react-hook-form with Zod validation
- **Icons:** Lucide React
- **AI Integration:** Google Gemini API

## 📁 Project Structure

```
ToolBox/
├── app/                    # Next.js 14 app directory
│   ├── tools/             # Individual tool pages
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                   # Utility functions and configurations
│   ├── db/               # Database models and services
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
└── .github/              # GitHub workflows and templates
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) and [Contributor License Agreement (CLA)](CLA.md) before submitting contributions.

**Important:** By contributing to this project, you agree to the terms outlined in our [CLA](CLA.md). All contributions require acceptance of the CLA.

### Quick Contribution Steps

1. Read and accept the [CLA](CLA.md)
2. Fork the repository
3. Create your feature branch (`git checkout -b feature/amazing-feature`)
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Ways to Contribute

- Add new tools to the collection
- Improve existing tools
- Fix bugs and issues
- Improve documentation
- Enhance UI/UX
- Optimize performance

## 📋 Issue Templates

We provide several issue templates to help you contribute:

- **New Tool** - Submit a new tool to be added to ToolBox
- **Bug Report** - Report bugs or issues
- **Feature Request** - Suggest new features or improvements
- **Tool Improvement** - Suggest improvements to existing tools

## 📄 License

This project is licensed under a **Proprietary License**. See the [LICENSE](LICENSE) file for details.

### Key License Terms:

- ✅ **View & Study**: You may view and study the source code for educational purposes
- ✅ **Fork to Contribute**: You may fork the repository to contribute back to the original project
- ❌ **No Redistribution**: You may NOT redistribute the software in any form
- ❌ **No Commercial Use**: Only the owner may use this commercially
- ❌ **No Derivatives**: You may NOT create competing products based on this software

### Commercial Rights

**ALL commercial rights are exclusively retained by Rishabh Dubey (GitHub: @rishabh3562).**

- ONLY the owner may monetize, sell, license, or commercialize this project
- Contributors grant exclusive commercial rights to the owner (see [CLA](CLA.md))
- Any commercial use by others requires explicit written permission

For commercial licensing inquiries, contact: @rishabh3562 on GitHub

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)

## 📧 Contact & Support

- **Owner:** Rishabh Dubey
- **GitHub:** [@rishabh3562](https://github.com/rishabh3562)
- **Project Link:** [https://github.com/rishabh3562/ToolBox](https://github.com/rishabh3562/ToolBox)
- **Issues:** [Report a bug or request a feature](https://github.com/rishabh3562/ToolBox/issues)
- **Commercial Licensing:** Contact @rishabh3562 on GitHub

## 🎯 Roadmap

- [ ] Add more built-in tools
- [ ] Implement tool categories and filtering
- [ ] Add user authentication and profiles
- [ ] Create tool marketplace
- [ ] Add tool ratings and reviews
- [ ] Implement tool search functionality
- [ ] Add API integrations for popular services

## ⭐ Show Your Support

If ToolBox helps improve your workflow, please consider:
- Giving it a star on GitHub
- Sharing it with your network
- Contributing new tools or features
- Reporting bugs and suggesting improvements

---

**Made with ❤️ for developers, by developers**

*Building the ultimate toolkit for modern development workflows.*
