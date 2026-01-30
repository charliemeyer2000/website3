import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Charlie Meyer";

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
            backgroundColor: "#006699",
            fontFamily: "Georgia, Times New Roman, serif",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "1080px",
              display: "flex",
              flexDirection: "column",
              borderTop: "3px solid #aaddee",
              borderLeft: "3px solid #aaddee",
              borderRight: "3px solid #446688",
              borderBottom: "3px solid #446688",
              boxShadow: "6px 6px 0px #003355",
              background: "#ffffee",
            }}
          >
            <div
              style={{
                background: "#003366",
                padding: "30px 40px 26px",
                borderBottom: "3px solid #006699",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "1px",
                }}
              >
                Charlie Meyer
              </div>
              <div
                style={{
                  fontSize: "22px",
                  color: "#88bbdd",
                  marginTop: "4px",
                }}
              >
                ai, llms, math, and interpretability
              </div>
            </div>
            <div
              style={{
                padding: "36px 40px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: 700,
                  color: "#003366",
                  lineHeight: 1.3,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  height: "3px",
                  background:
                    "linear-gradient(to right, transparent, #006699, #003366, #006699, transparent)",
                  width: "100%",
                }}
              />
              <div
                style={{
                  fontSize: "20px",
                  color: "#0000cc",
                  textDecoration: "underline",
                  fontFamily: "Courier New, monospace",
                }}
              >
                charliemeyer.xyz
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.log(`${e instanceof Error ? e.message : "Unknown error"}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
