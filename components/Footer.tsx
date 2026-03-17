import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-remax-slate/10 mt-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/remax-logo.svg"
                alt="RE/MAX"
                width={80}
                height={32}
                className="h-8 w-auto"
              />
              <div className="h-8 w-px bg-remax-slate/20" />
              <span className="text-base font-semibold text-remax-slate">
                {siteConfig.contact.name}
              </span>
            </div>
            <p className="text-sm text-remax-slate/80">
              {siteConfig.business.brokerage} | NY & NJ Real Estate Specialist
            </p>
            <div className="text-sm text-remax-slate/80 space-y-1">
              <p>{siteConfig.contact.phoneDisplay}</p>
              <p>{siteConfig.contact.email}</p>
            </div>
            <div className="text-sm text-remax-slate/80 space-y-1 mt-3">
              <p>Licensed Real Estate Salesperson</p>
              <p>New York & New Jersey</p>
              <p>NY License #10401392134 | NJ License #1430283</p>
            </div>
            
            {/* Professional Logos */}
            <div className="flex items-center gap-4 mt-4">
              <Image
                src="/realtor-logo.svg"
                alt="REALTOR®"
                width={100}
                height={40}
                className="h-10 w-auto opacity-70"
              />
              <Image
                src="/realtor-r.jpg"
                alt="REALTOR® Member"
                width={40}
                height={40}
                className="h-10 w-auto opacity-70"
              />
              <Image
                src="/equal-housing.png"
                alt="Equal Housing Opportunity"
                width={40}
                height={40}
                className="h-10 w-auto opacity-70"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-remax-blue mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {siteConfig.nav.footer.services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-remax-slate hover:text-remax-blue transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-remax-blue mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              {siteConfig.nav.footer.resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-remax-slate hover:text-remax-blue transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Media Icons */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-remax-blue mb-3">Follow Me</h4>
              <div className="flex gap-4 items-center">
                {siteConfig.social.facebook && (
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-remax-slate hover:text-remax-blue transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social.instagram && (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-remax-slate hover:text-remax-blue transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social.linkedin && (
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-remax-slate hover:text-remax-blue transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social.youtube && (
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-remax-slate hover:text-remax-blue transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
              
              {/* Zillow Profile */}
              {siteConfig.social.zillow && (
                <div className="mt-4">
                  <a
                    href={siteConfig.social.zillow}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:opacity-80 transition-opacity"
                    aria-label="View my Zillow profile"
                  >
                    <Image
                      src="/zillow-icon.svg"
                      alt="Zillow"
                      width={80}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Children's Miracle Network */}
        <div className="border-t border-remax-slate/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <a 
              href="https://resources.miraclehomeprogram.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/cmn-logo.png"
                alt="RE/MAX and Children's Miracle Network Hospitals"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </a>
            <p className="text-sm text-remax-slate/80 max-w-2xl">
              RE/MAX is proud to support Children's Miracle Network Hospitals. 
              A portion of every transaction goes to help save and improve the lives of children 
              treated at member hospitals.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-remax-slate/10">
          <p className="text-sm text-remax-slate/60 text-center">
            © {new Date().getFullYear()} {siteConfig.contact.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
