import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 60 minutes

interface Review {
  Description: string;
  ReviewerFullName: string;
  FreeFormLocation: string;
  Rating: number;
}

export async function GET() {
  try {
    const apiKey = process.env.BRIDGE_DATA_API_KEY;
    
    if (!apiKey) {
      console.error("BRIDGE_DATA_API_KEY not configured");
      return NextResponse.json([], { status: 200 });
    }

    const response = await fetch(
      `https://api.bridgedataoutput.com/api/v2/OData/reviews/Reviews?access_token=${apiKey}&$filter=AccountIdReviewee eq '20943858'&$top=6`
    );

    if (!response.ok) {
      console.error("Failed to fetch reviews:", response.status);
      return NextResponse.json([], { status: 200 });
    }

    const data = await response.json();
    const reviews: Review[] = data?.value || [];

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json([], { status: 200 });
  }
}
