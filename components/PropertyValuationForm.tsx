"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSafeReCaptcha } from "./SafeRecaptchaProvider";
import { siteConfig } from "@/lib/config";
import { getAttribution } from "@/lib/attribution";

const telHref = `tel:${siteConfig.contact.phone.replace(/[\s()-]/g, "")}`;

interface Suggestion {
  placeId: string;
  description: string;
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
  address: string;
}

interface ValuationResult {
  zestimate: number;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const pushDataLayer = (event: string, data?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event, ...data });
  }
};

export default function PropertyValuationForm() {
  const { executeRecaptcha } = useSafeReCaptcha();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (addressData) return; // already resolved, don't re-fetch
    if (query.length < 3) { 
      setSuggestions([]);
      setAddressError("");
      return; 
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsLoadingSuggestions(true);
    setAddressError("");
    
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (!res.ok) {
          setAddressError(data.error || "Failed to load address suggestions");
          setSuggestions([]);
          return;
        }
        
        if (data.error) {
          setAddressError(data.error);
          setSuggestions([]);
          return;
        }
        
        setSuggestions(data.predictions || []);
      } catch (error) {
        console.error("Address autocomplete error:", error);
        setAddressError("Failed to load address suggestions");
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);
  }, [query, addressData]);

  const handleSelect = async (suggestion: Suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    setAddressError("");
    
    try {
      const res = await fetch(`/api/places/details?placeId=${suggestion.placeId}`);
      const data = await res.json();
      
      if (!res.ok) {
        setAddressError(data.error || "Failed to load address details");
        return;
      }
      
      setAddressData(data);
    } catch (error) {
      console.error("Address details error:", error);
      setAddressError("Failed to load address details");
    }
  };

  const handleFormStart = () => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      pushDataLayer("form_start", { form_name: "valuation_form" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData) {
      setError("Please select an address from the suggestions.");
      return;
    }
    setStatus("loading");
    setError("");
    pushDataLayer("form_submit", { form_name: "valuation_form" });
    try {
      let recaptchaToken = "";
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("valuation_form");
      }
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...addressData,
          ...formData,
          pageUrl: window.location.href,
          recaptchaToken,
          ...(getAttribution() ? { attribution: getAttribution() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to retrieve valuation.");
      setResult(data.valuation);
      setStatus("success");
      // user_data feeds GTM's Enhanced Conversions variable (Google hashes it
      // client-side before sending) — never put this data in URLs/GA4 params
      const [firstName, ...lastParts] = formData.name.trim().split(/\s+/);
      pushDataLayer("form_success", {
        form_name: "valuation_form",
        has_zestimate: (data.valuation?.zestimate ?? 0) > 0,
        user_data: {
          email: formData.email,
          phone_number: formData.phone,
          address: { first_name: firstName || "", last_name: lastParts.join(" ") },
        },
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
      pushDataLayer("form_error", { form_name: "valuation_form", error_message: err.message });
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent";

  if (status === "success" && result) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 space-y-5">
        {result.zestimate > 0 ? (
          <div className="text-center space-y-2">
            <div className="text-green-600 font-semibold text-sm uppercase tracking-wide">
              Estimated Property Value
            </div>
            <div className="text-5xl font-bold text-remax-blue">
              ${Number(result.zestimate).toLocaleString()}
            </div>
            {result.address && (
              <p className="text-remax-slate/70 text-sm">{result.address}</p>
            )}
            {/* Zillow branding requirement: logo adjacent to Zestimate data */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-remax-slate/50">Zestimate® by</span>
              <Image src="/zillow-icon.svg" alt="Zillow" width={60} height={24} className="h-5 w-auto" />
            </div>
            <p className="text-xs text-remax-slate/50 border-t pt-3">
              This is a Zillow Zestimate, not a professional appraisal. Actual value may differ based on condition and local market.
              {" "}Data provided &quot;as is&quot; via the Zestimate API.
            </p>
            {result.address && (
              <p className="text-xs text-remax-slate/50">
                <a
                  href={`https://www.zillow.com/homes/${encodeURIComponent([result.address, result.city, result.state, result.zip].filter(Boolean).join(" "))}_rb/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-remax-blue"
                >
                  See more details for {result.address} on Zillow
                </a>
              </p>
            )}
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-remax-blue font-semibold text-lg">We received your information</div>
            <p className="text-remax-slate/70 text-sm">
              Jose will do a custom property analysis when he reaches out to you.
            </p>
          </div>
        )}
        <div className="bg-remax-blue/5 border border-remax-blue/20 rounded-lg p-5 space-y-3">
          <p className="font-semibold text-remax-blue">What happens next:</p>
          <p className="text-remax-slate text-sm">
            Jose will personally review your property and reach out within a few hours during business hours to walk through your options — no pressure, no obligation.
          </p>
          <p className="text-sm">
            Or call him now:{" "}
            <a href={telHref} className="text-remax-blue font-semibold hover:underline">
              {siteConfig.contact.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Property Address"
          required
          value={query}
          onChange={(e) => { setQuery(e.target.value); setAddressData(null); }}
          onFocus={handleFormStart}
          className={inputClass}
          autoComplete="off"
        />
        {isLoadingSuggestions && (
          <div className="absolute right-3 top-3 text-remax-slate/50">
            <div className="animate-spin h-5 w-5 border-2 border-remax-blue border-t-transparent rounded-full"></div>
          </div>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-remax-slate/20 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
            {suggestions.map((s) => (
              <li
                key={s.placeId}
                onClick={() => handleSelect(s)}
                className="px-4 py-3 hover:bg-remax-blue/5 cursor-pointer text-sm text-remax-slate"
              >
                {s.description}
              </li>
            ))}
          </ul>
        )}
        {addressError && (
          <div className="absolute z-10 w-full bg-red-50 border border-red-200 rounded-lg shadow-lg mt-1 p-3">
            <p className="text-red-600 text-sm">{addressError}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onFocus={handleFormStart}
          className={inputClass}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          onFocus={handleFormStart}
          className={inputClass}
        />
      </div>

      <input
        type="email"
        placeholder="Email Address"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        onFocus={handleFormStart}
        className={inputClass}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-remax-blue text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Analyzing Property..." : "Get My Free Property Valuation"}
      </button>

      <p className="text-xs text-remax-slate/50 text-center">
        Your information is confidential and will never be shared.
      </p>
    </form>
  );
}
