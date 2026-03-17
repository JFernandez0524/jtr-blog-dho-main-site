"use client";

import { useState, useEffect } from "react";
import { getHeroImage, getFallbackImage } from "@/lib/unsplash";

interface AsyncHeroImageProps {
  pageType: string;
  className?: string;
  children: React.ReactNode;
}

export default function AsyncHeroImage({ pageType, className = "", children }: AsyncHeroImageProps) {
  const fallbackImage = getFallbackImage(pageType);
  const [backgroundImage, setBackgroundImage] = useState<string>(fallbackImage);

  useEffect(() => {
    // Load Unsplash image asynchronously
    getHeroImage(pageType).then((heroImage) => {
      if (heroImage && heroImage !== fallbackImage) {
        setBackgroundImage(heroImage);
      }
    }).catch(() => {
      // Keep fallback on error
      setBackgroundImage(fallbackImage);
    });
  }, [pageType, fallbackImage]);

  return (
    <section 
      className={className}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {children}
    </section>
  );
}
