"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-remax-slate/10 bg-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-4">
            <div className="py-logo-clear-x px-logo-clear-x">
              <span className="text-xl sm:text-2xl font-bold text-remax-blue tracking-tight">
                REMAX
              </span>
            </div>
            <div className="h-5 sm:h-6 w-px bg-remax-slate/20 mx-logo-clear-m" />
            <span className="text-base sm:text-xl font-remax text-remax-slate">
              {siteConfig.contact.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {siteConfig.nav.main.map((item) => {
              const isContact = item.href === "/contact";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      isContact
                        ? "px-6 py-2 bg-remax-blue text-white rounded hover:opacity-90 transition-opacity"
                        : "text-remax-slate hover:text-remax-blue transition-colors"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-remax-slate hover:text-remax-blue"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <ul className="lg:hidden mt-4 space-y-2 pb-4">
            {siteConfig.nav.main.map((item) => {
              const isContact = item.href === "/contact";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={
                      isContact
                        ? "block px-4 py-3 bg-remax-blue text-white rounded text-center"
                        : "block px-4 py-3 text-remax-slate hover:bg-remax-blue/5 rounded"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </header>
  );
}
