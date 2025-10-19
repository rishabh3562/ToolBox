import { Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <Link
              href="/"
              className="font-medium underline underline-offset-4"
            >
              DevTools
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com"
              target="_blank"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="https://github.com" target="_blank">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="https://twitter.com" target="_blank">
            <Twitter className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}