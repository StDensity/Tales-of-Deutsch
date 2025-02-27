import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-card-bg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl text-accent">
              Tales of Deutsch
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link href="/" className="text-text-primary hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-text-primary hover:text-accent transition-colors">
              About
            </Link>
            <Link href="/stories" className="text-text-primary hover:text-accent transition-colors">
              All Stories
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}