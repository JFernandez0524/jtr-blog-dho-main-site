"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Review {
  Description: string;
  ReviewerFullName: string;
  FreeFormLocation: string;
  Rating: number;
}

export default function ZillowReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-remax-slate/60">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
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
          {reviews.map((review, index) => (
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
              <p className="text-remax-slate/80 text-sm italic mb-4 line-clamp-4">
                "{review.Description.substring(0, 180)}..."
              </p>
              <div className="border-t border-remax-slate/10 pt-4">
                <p className="font-semibold text-remax-slate">
                  {review.ReviewerFullName || "Verified Client"}
                </p>
                <p className="text-sm text-remax-slate/60">
                  {review.FreeFormLocation || "New Jersey"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.zillow.com/profile/Jose%20Fernandez%20NJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-remax-blue text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            View All Reviews on Zillow
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
