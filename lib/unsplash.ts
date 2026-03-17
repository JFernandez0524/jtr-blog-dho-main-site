const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Search queries for each page type
const SEARCH_QUERIES = {
  'inherited-property': 'beautiful house exterior family home',
  'foreclosure': 'real estate for sale house',
  'sell-as-is': 'house exterior architecture property',
  'contact': 'professional handshake business meeting',
  'homepage': 'modern house real estate',
  'blog': 'real estate professional',
  'default': 'beautiful house exterior'
} as const;

export type HeroImageType = keyof typeof SEARCH_QUERIES;

export async function getHeroImage(pageType: string): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('UNSPLASH_ACCESS_KEY not configured, using fallback');
    return getFallbackImage(pageType);
  }

  try {
    const query = SEARCH_QUERIES[pageType as keyof typeof SEARCH_QUERIES] || SEARCH_QUERIES.default;
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
      return getFallbackImage(pageType);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      // Use regular size (1080px width) for good performance
      const imageUrl = photo.urls.regular;
      console.log(`Generated image URL for ${pageType}: ${imageUrl}`);
      return imageUrl;
    }
    
    console.log(`No results found for ${pageType}, using fallback`);
    return getFallbackImage(pageType);
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return getFallbackImage(pageType);
  }
}

export function getFallbackImage(pageType: string): string {
  // Use Lorem Picsum as reliable fallback with consistent seed
  const width = 1920;
  const height = 1080;
  const seed = pageType.replace('-', ''); // Remove hyphens for seed
  
  const fallbackUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  console.log(`Generated fallback URL for ${pageType}: ${fallbackUrl}`);
  return fallbackUrl;
}

export function getOptimizedImageUrl(rawUrl: string, width: number = 1920, height: number = 1080): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('q', '80');
    return url.toString();
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return rawUrl;
  }
}
