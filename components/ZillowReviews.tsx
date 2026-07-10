"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Review {
  Description: string;
  ReviewerFullName: string | null;
  ReviewerScreenName: string;
  FreeFormLocation: string;
  Rating: number;
}

export default function ZillowReviews({
  compact = false,
  maxReviews = 6,
}: {
  /** Compact mode for landing pages — renders inside the parent's width, no full-bleed section */
  compact?: boolean;
  maxReviews?: number;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    // Compact (landing page) mode must never flash a broken-looking block
    if (compact) return null;
    return (
      <div className="text-center py-12">
        <p className="text-remax-slate/60">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const visibleReviews = reviews.slice(0, maxReviews);

  if (compact) {
    return (
      <section className="space-y-5">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">What NJ Families Say</h2>
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/zillow-icon.svg"
              alt="Zillow"
              width={80}
              height={32}
              className="h-7 w-auto"
            />
            <span className="text-sm text-gray-500">Verified Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visibleReviews.map((review, index) => (
            <div key={index} className="border border-gray-200 rounded-2xl p-5 bg-white">
              <div className="flex gap-0.5 mb-3 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm italic mb-3 line-clamp-4" title={review.Description}>
                "{review.Description}"
              </p>
              <div className="border-t border-gray-100 pt-3">
                <p className="font-semibold text-gray-800 text-sm">
                  {review.ReviewerFullName || review.ReviewerScreenName || "Verified Client"}
                </p>
                <p className="text-xs text-gray-500">
                  {review.FreeFormLocation || "New Jersey"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://www.zillow.com/profile/Jose%20Fernandez%20NJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-[#006AFF] font-semibold hover:underline"
          >
            See all my reviews on Zillow →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-remax-slate/5 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="mb-4">What My Clients Say</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="/zillow-icon.svg"
              alt="Zillow"
              width={80}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-remax-slate/60">Verified Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-remax-slate/80 text-sm italic mb-4 line-clamp-4 cursor-help" title={review.Description}>
                "{review.Description}"
              </p>
              <div className="border-t border-remax-slate/10 pt-4">
                <p className="font-semibold text-remax-slate">
                  {review.ReviewerFullName || review.ReviewerScreenName || "Verified Client"}
                </p>
                <p className="text-sm text-remax-slate/60">
                  {review.FreeFormLocation || "New Jersey"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-remax-slate/60">
          All reviews verified on{" "}
          <a
            href="https://www.zillow.com/profile/Jose%20Fernandez%20NJ"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-remax-blue"
          >
            Zillow
          </a>
          .
        </p>
      </div>
    </section>
  );
}
