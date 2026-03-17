"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
}

export default function PropertyValuationForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData) {
      setError("Please select an address from the suggestions.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addressData, ...formData }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to retrieve valuation.");
      setResult(data.valuation);
      setStatus("success");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent";

  if (status === "success" && result) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center space-y-4">
        <div className="text-green-600 font-semibold text-sm uppercase tracking-wide">
          Estimated Property Value
        </div>
        <div className="text-5xl font-bold text-remax-blue">
          ${Number(result.zestimate).toLocaleString()}
        </div>
        {result.address && (
          <p className="text-remax-slate/70 text-sm">{result.address}</p>
        )}
        <p className="text-xs text-remax-slate/50 border-t pt-4">
          ⚠️ This is a Zillow Zestimate and not a professional appraisal. Actual value may differ based on property condition and local market factors.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-2 px-6 py-3 bg-remax-blue text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Get a Professional Valuation from Jose
        </Link>
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
          className={inputClass}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={inputClass}
        />
      </div>

      <input
        type="email"
        placeholder="Email Address"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
