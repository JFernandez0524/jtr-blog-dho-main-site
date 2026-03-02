import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function Header() {
  return (
    <header className="border-b border-remax-slate/10 bg-white">
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo with 2025 RE/MAX Brand Standards */}
          <Link href="/" className="flex items-center gap-4">
            {/* REMAX Logotype with mandatory clear space */}
            <div className="py-logo-clear-x px-logo-clear-x">
              <span className="text-2xl font-bold text-remax-blue tracking-tight">
                REMAX
              </span>
            </div>
            
            {/* Horizontal separation: width of 'M' stroke */}
            <div className="h-6 w-px bg-remax-slate/20 mx-logo-clear-m" />
            
            {/* Associate name: 75% of REMAX height (text-xl = 75% of text-2xl) */}
            <span className="text-xl font-remax text-remax-slate">
              {siteConfig.contact.name}
            </span>
          </Link>

          {/* Navigation */}
          <ul className="flex items-center gap-8">
            {siteConfig.nav.main.map((item, index) => {
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
        </div>
      </nav>
    </header>
  );
}
