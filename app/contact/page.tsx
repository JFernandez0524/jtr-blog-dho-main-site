import { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import AsyncHeroImage from "@/components/AsyncHeroImage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Jose Fernandez | Free Real Estate Consultation - NJ",
  description: "Get expert guidance on inherited property, foreclosure, or selling as-is. Free, confidential consultation with no pressure.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <AsyncHeroImage
        pageType="contact"
        className="bg-gradient-to-b from-remax-blue/5 to-white py-20 relative"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Image
            src="/jose-profile.jpg"
            alt={siteConfig.contact.name}
            width={150}
            height={150}
            className="rounded-full mx-auto mb-6 shadow-lg"
          />
          <h1 className="text-balance mb-4 text-white">Let's Discuss Your Situation</h1>
          <p className="text-xl text-white/90">
            Free, confidential consultation with no pressure or obligation.
          </p>
        </div>
      </AsyncHeroImage>

      {/* Contact Form & Info */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-3xl mb-6">Send Me a Message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl mb-6">Other Ways to Reach Me</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-remax-blue/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-remax-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-remax-blue mb-1">Phone</h3>
                    <a href={`tel:${siteConfig.contact.phone}`} className="text-remax-slate hover:text-remax-blue">
                      {siteConfig.contact.phoneDisplay}
                    </a>
                    <p className="text-sm text-remax-slate/60">Mon-Fri 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-remax-blue/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-remax-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-remax-blue mb-1">Email</h3>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-remax-slate hover:text-remax-blue">
                      {siteConfig.contact.email}
                    </a>
                    <p className="text-sm text-remax-slate/60">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-remax-blue/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-remax-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-remax-blue mb-1">Office</h3>
                    <p className="text-remax-slate">{siteConfig.contact.address.full}</p>
                    <p className="text-sm text-remax-slate/60">Available for in-person meetings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-remax-blue/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-remax-blue mb-4">What to Expect</h3>
              <ul className="space-y-3 text-remax-slate">
                <li className="flex gap-2">
                  <span className="text-remax-blue">✓</span>
                  <span>Response within 24 hours</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-remax-blue">✓</span>
                  <span>Free consultation with no obligation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-remax-blue">✓</span>
                  <span>Confidential discussion of your situation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-remax-blue">✓</span>
                  <span>Clear explanation of your options</span>
                </li>
              </ul>
            </div>

            {/* Professional Credentials */}
            <div className="border-t border-remax-slate/10 pt-6 mt-6">
              <h3 className="font-semibold text-remax-blue mb-2">Professional Credentials</h3>
              <div className="text-sm text-remax-slate/80 space-y-1">
                <p>Licensed Real Estate Salesperson</p>
                <p>New York & New Jersey</p>
                <p>NY License #10401392134 | NJ License #1430283</p>
                <p>RE/MAX Homeland Realtors</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
