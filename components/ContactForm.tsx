"use client";

import { useState, FormEvent } from "react";
import { siteConfig } from "@/lib/config";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    serviceType: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: window.location.href,
          referrer: document.referrer || "direct",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "", serviceType: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or call us directly.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-remax-slate mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent"
          placeholder="John Smith"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-remax-slate mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent"
          placeholder="john@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-remax-slate mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent"
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Service Type */}
      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-remax-slate mb-2">
          How Can I Help? *
        </label>
        <select
          id="serviceType"
          required
          value={formData.serviceType}
          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent"
        >
          <option value="">Select a service...</option>
          {siteConfig.services.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-remax-slate mb-2">
          Tell Me About Your Situation *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent resize-none"
          placeholder="Please share any details that will help me understand your needs..."
        />
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">Thank you for reaching out!</p>
          <p className="text-green-700 text-sm mt-1">
            I'll review your message and get back to you within 24 hours.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Oops! Something went wrong.</p>
          <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-8 py-4 bg-remax-blue text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>

      <p className="text-sm text-remax-slate/60 text-center">
        Your information is confidential and will never be shared.
      </p>
    </form>
  );
}
