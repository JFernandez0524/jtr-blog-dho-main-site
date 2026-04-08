"use client";

import { useState, FormEvent } from "react";
import { useSafeReCaptcha } from "./SafeRecaptchaProvider";
import { siteConfig } from "@/lib/config";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function ContactForm() {
  const { executeRecaptcha } = useSafeReCaptcha();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    serviceType: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formStarted, setFormStarted] = useState(false);

  const pushDataLayer = (event: string, data?: any) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event, ...data });
    }
  };

  const handleFieldFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      pushDataLayer("form_start", { form_name: "contact_form" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});

    pushDataLayer("form_submit", { form_name: "contact_form" });

    try {
      // Get reCAPTCHA token
      let recaptchaToken = "";
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("contact_form");
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
          source: window.location.href,
          referrer: document.referrer || "direct",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          setFieldErrors(data.details);
          setStatus("error");
          setErrorMessage("Please fix the errors below");
          pushDataLayer("form_error", { 
            form_name: "contact_form",
            error_type: "validation"
          });
        } else if (response.status === 429) {
          setStatus("error");
          setErrorMessage("Too many submissions. Please try again in an hour.");
          pushDataLayer("form_error", { 
            form_name: "contact_form",
            error_type: "rate_limit"
          });
        } else {
          throw new Error(data.error || "Failed to submit form");
        }
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "", serviceType: "" });
      pushDataLayer("form_success", { 
        form_name: "contact_form",
        service_type: formData.serviceType
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or call us directly.");
      pushDataLayer("form_error", { 
        form_name: "contact_form",
        error_type: "server_error"
      });
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
          onFocus={handleFieldFocus}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent"
          placeholder="John Smith"
        />
        {fieldErrors.name && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.name[0]}</p>
        )}
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
          onFocus={handleFieldFocus}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent"
          placeholder="john@example.com"
        />
        {fieldErrors.email && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.email[0]}</p>
        )}
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
          onFocus={handleFieldFocus}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent"
          placeholder="(555) 123-4567"
        />
        {fieldErrors.phone && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.phone[0]}</p>
        )}
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
          onFocus={handleFieldFocus}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent"
        >
          <option value="">Select a service...</option>
          {siteConfig.services.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
        {fieldErrors.serviceType && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.serviceType[0]}</p>
        )}
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
          onFocus={handleFieldFocus}
          className="w-full px-4 py-3 border border-remax-slate/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-remax-blue focus:border-transparent resize-none"
          placeholder="Please share any details that will help me understand your needs..."
        />
        {fieldErrors.message && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.message[0]}</p>
        )}
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg" role="alert" aria-live="polite">
          <p className="text-green-800 font-medium">Thank you for reaching out!</p>
          <p className="text-green-700 text-sm mt-1">
            I'll review your message and get back to you within 24 hours.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
          <p className="text-red-800 font-medium">Oops! Something went wrong.</p>
          <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        aria-label="Submit contact form"
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
