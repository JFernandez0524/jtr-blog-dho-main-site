import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function BlogCTA() {
  return (
    <div className="bg-gradient-to-br from-remax-blue to-remax-blue/80 text-white rounded-2xl p-8 md:p-12 my-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold text-white">
          Need Help With Your Real Estate Situation?
        </h3>
        <p className="text-lg text-white/90">
          Whether you've inherited a property, facing foreclosure, or need to sell as-is, 
          I'm here to help. Get a free, no-obligation consultation today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="px-8 py-4 bg-white text-remax-blue font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            Schedule Free Consultation
          </Link>
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Call {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
