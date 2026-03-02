import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Jose Fernandez | NJ Real Estate Specialist";
    const type = searchParams.get("type") || "default";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            backgroundImage: "linear-gradient(to bottom right, #003DA5 0%, #003DA5 50%, #fff 50%)",
          }}
        >
          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "80px",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: type === "blog" ? 64 : 72,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
                marginBottom: 40,
                maxWidth: "900px",
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              {title}
            </div>

            {/* Author Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: "20px 40px",
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: "#003DA5",
                  marginRight: 20,
                }}
              >
                REMAX
              </div>
              <div
                style={{
                  width: 2,
                  height: 40,
                  backgroundColor: "#63666A",
                  opacity: 0.3,
                  marginRight: 20,
                }}
              />
              <div
                style={{
                  fontSize: 28,
                  color: "#63666A",
                }}
              >
                Jose Fernandez | NJ Specialist
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OG Image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
