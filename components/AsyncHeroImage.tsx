"use client";

import { useState, useEffect } from "react";
import { getHeroImage, getFallbackImage } from "@/lib/unsplash";

interface AsyncHeroImageProps {
  pageType: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export default function AsyncHeroImage({ pageType, title, className = "", children }: AsyncHeroImageProps) {
  const fallbackImage = getFallbackImage(pageType);
  const [backgroundImage, setBackgroundImage] = useState<string>(fallbackImage);

  useEffect(() => {
    // Load Unsplash image asynchronously
    getHeroImage(pageType, title).then((heroImage) => {
      if (heroImage && heroImage !== fallbackImage) {
        setBackgroundImage(heroImage);
      }
    }).catch(() => {
      // Keep fallback on error
      setBackgroundImage(fallbackImage);
    });
  }, [pageType, title, fallbackImage]);

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
