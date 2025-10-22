import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Clock,
  Lock,
  Code,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    name: "Lightning Fast",
    description:
      "All tools are optimized for speed and efficiency, running directly in your browser.",
    icon: Zap,
  },
  {
    name: "Time Saving",
    description:
      "Automate repetitive tasks and streamline your development workflow.",
    icon: Clock,
  },
  {
    name: "Secure",
    description:
      "Your data stays in your browser. No server-side processing or storage.",
    icon: Lock,
  },
];

const tools = [
  {
    name: "Template Manager",
    description: "Create and manage professional templates with ease.",
    icon: Code,
  },
  {
    name: "Markdown Editor",
    description:
      "Rich markdown editing with live preview and syntax highlighting.",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden bg-gradient-to-b from-background to-background/80">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="container relative mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-block animate-bounce-slow">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">
                New Tools Added Weekly
              </span>
            </div>
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white">
              Professional Tools for{" "}
              <span className="text-primary">Modern Developers</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A collection of powerful tools designed to streamline your
              development workflow and boost productivity. Built by developers,
              for developers.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/tools">
                <Button size="lg" className="h-12 px-6">
                  Explore Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank">
                <Button size="lg" variant="outline" className="h-12 px-6">
                  View on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Tools</h2>
            <p className="text-muted-foreground text-lg">
              Discover our most popular developer tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-background to-muted p-8 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{tool.name}</h3>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Tools?</h2>
            <p className="text-muted-foreground text-lg">
              Designed with performance and usability in mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative p-8 bg-gradient-to-br from-muted/50 to-background rounded-xl border transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-primary/10 rounded-xl">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.name}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of developers who use our tools to boost their
            productivity.
          </p>
          <Link href="/tools">
            <Button size="lg" className="h-12 px-8">
              View All Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
