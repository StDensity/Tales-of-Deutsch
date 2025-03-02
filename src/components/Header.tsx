"use client"

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-card-bg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl md:text-2xl text-accent">
              Tales of Deutsch
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`transition-colors ${isActive('/') ? 'text-accent font-medium' : 'text-text-primary hover:text-accent'}`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors ${isActive('/about') ? 'text-accent font-medium' : 'text-text-primary hover:text-accent'}`}
            >
              About
            </Link>
            <Link 
              href="/stories" 
              className={`transition-colors ${isActive('/stories') ? 'text-accent font-medium' : 'text-text-primary hover:text-accent'}`}
            >
              All Stories
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-primary hover:text-accent focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 space-y-2">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-accent font-medium' 
                  : 'text-text-primary hover:text-accent hover:bg-background'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 rounded-md transition-colors ${
                isActive('/about') 
                  ? 'text-accent font-medium' 
                  : 'text-text-primary hover:text-accent hover:bg-background'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/stories" 
              className={`block px-3 py-2 rounded-md transition-colors ${
                isActive('/stories') 
                  ? 'text-accent font-medium' 
                  : 'text-text-primary hover:text-accent hover:bg-background'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              All Stories
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}