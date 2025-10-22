# ToolBox 🧰

**The Community-Driven Developer Toolbox - Built by Developers, For Developers**

A revolutionary open-source platform democratizing developer productivity tools. Create, share, and discover tools that streamline your workflow - all with personalized, auth-based storage and a thriving community marketplace.

![ToolBox Banner](https://github.com/user-attachments/assets/19845877-517c-482c-9d25-c06134a81f95)

## 🌟 Vision

ToolBox is revolutionizing how developers create and share productivity tools. We're building more than just a collection of utilities - we're creating a **democratized marketplace** where any developer can contribute tools, share knowledge, and build upon each other's work.

### Why ToolBox?

- **🌍 Community-First**: Every developer can contribute tools, not just consume them
- **🔐 Privacy-Focused**: Your data is yours - auth-based storage ensures complete privacy
- **🔌 Plugin Architecture**: Build and share tools without touching the core codebase
- **🤝 Open Collaboration**: Real-time collaboration, sharing, and team features
- **🚀 Modern Stack**: Built with Next.js 14, TypeScript, and cutting-edge technologies

## ✨ Core Features

### 🎯 Current Features

- **🔐 User Authentication** - Secure login with GitHub/Google OAuth (Coming Soon)
- **💾 Personal Storage** - Auth-based data storage - your templates, snippets, and tools are private by default
- **⚡ Lightning Fast** - Optimized performance with tools running directly in your browser
- **🎨 Modern UI** - Beautiful, responsive interface built with Radix UI and Tailwind CSS
- **🌙 Dark Mode** - Full dark mode support for comfortable extended use
- **📦 MongoDB Integration** - Robust data storage with user isolation
- **🛡️ Type Safe** - Built with TypeScript for reliability and superior developer experience
- **🚨 Rate Limiting** - API protection with intelligent rate limiting and IP-based tracking

### 🚀 Roadmap (Community Contributions Welcome!)

- **🔌 Plugin Marketplace** - Discover and install community-created tools
- **👥 Real-time Collaboration** - Work together on templates and snippets
- **🤖 AI-Powered Tools** - Intelligent code suggestions and automation
- **📱 Mobile Apps** - Native iOS and Android applications
- **🌐 Public API & SDK** - Programmatic access to all features
- **📊 Analytics Dashboard** - Insights into your productivity and tool usage

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

## 🤝 Contributing - We Need You!

**ToolBox is built by the community, for the community.** We're actively seeking contributors to help us democratize developer tools!

### 🎃 Hacktoberfest 2025 Participant

We're participating in Hacktoberfest! Check out our [curated issues for contributors](https://github.com/rishabh3562/ToolBox/labels/hacktoberfest).

### Quick Contribution Steps

1. **Read the docs**: Check our [Contributing Guide](CONTRIBUTING.md) and [CLA](CLA.md)
2. **Find an issue**: Browse [good first issues](https://github.com/rishabh3562/ToolBox/labels/good%20first%20issue)
3. **Fork & code**: Create your feature branch (`git checkout -b feature/amazing-feature`)
4. **Test thoroughly**: Ensure your changes work as expected
5. **Submit PR**: Push your branch and open a Pull Request
6. **Collaborate**: Work with maintainers to refine your contribution

### 🎯 High-Impact Contribution Areas

We especially need help with:

#### 🔐 **Authentication & Privacy** (Critical)

- Implementing NextAuth.js with GitHub/Google OAuth
- Migrating to user-scoped database architecture
- Building privacy controls and data isolation

#### 🔌 **Plugin Architecture** (Game-Changer)

- Designing plugin API and manifest format
- Building plugin loader and sandbox environment
- Creating plugin SDK and documentation

#### 🛒 **Tool Marketplace** (Core Vision)

- Building tool discovery and submission system
- Implementing ratings, reviews, and categories
- Creating tool analytics dashboard

#### 👥 **Collaboration Features** (Exciting)

- Real-time editing with WebSockets
- Team workspaces and sharing
- Live presence indicators

#### 🤖 **AI Integration** (Innovative)

- Expanding AI features beyond schema generation
- Code suggestions and auto-completion
- Intelligent search and recommendations

#### 📱 **Mobile & Cross-Platform** (Expanding Reach)

- React Native or Capacitor mobile apps
- PWA implementation
- Offline functionality

### 💡 Ways to Contribute

- **Code**: Features, bug fixes, optimizations
- **Design**: UI/UX improvements, icons, animations
- **Documentation**: Guides, tutorials, API docs
- **Testing**: Write tests, report bugs, QA
- **Ideas**: Suggest features, tools, improvements
- **Community**: Help others, answer questions, review PRs

**Important:** By contributing, you agree to our [CLA](CLA.md) terms.

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

## 🎯 Roadmap to Democratization

### Phase 1: Foundation (Q1 2025) 🏗️

- [x] Core tool infrastructure
- [ ] User Authentication (GitHub, Google OAuth)
- [ ] User-scoped data storage with privacy controls
- [ ] User profiles and preferences

### Phase 2: Community Platform (Q2 2025) 👥

- [ ] Tool Marketplace for discovery
- [ ] Plugin architecture for community tools
- [ ] Tool submission and approval workflow
- [ ] Rating and review system
- [ ] Social features (follow, like, share)

### Phase 3: Collaboration & Scale (Q3 2025) 🚀

- [ ] Real-time collaboration features
- [ ] Team workspaces and organizations
- [ ] Advanced search and discovery
- [ ] Public API and SDK
- [ ] Mobile applications (iOS/Android)

### Phase 4: Intelligence & Expansion (Q4 2025) 🤖

- [ ] AI-powered tool suggestions
- [ ] Automated code generation
- [ ] Advanced analytics and insights
- [ ] Enterprise features
- [ ] International expansion

## ⭐ Show Your Support

If ToolBox helps improve your workflow, please consider:

- Giving it a star on GitHub
- Sharing it with your network
- Contributing new tools or features
- Reporting bugs and suggesting improvements

---

**Made with ❤️ for developers, by developers**

_Building the ultimate toolkit for modern development workflows._
