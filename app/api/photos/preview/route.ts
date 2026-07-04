import { NextRequest, NextResponse } from "next/server";

const PHOTOS_PREVIEW_API = "https://photos.charliemeyer.xyz/api/files/preview";

// Presigned URLs from the photos service expire after 3600s; cache them for
// half that so redirects always point at a URL with plenty of validity left.
const PRESIGN_CACHE_SECONDS = 1800;

/**
 * Redirects to a presigned S3 URL for a file hosted on photos.charliemeyer.xyz,
 * so media can be embedded same-origin (e.g. <video src="/api/photos/preview?key=...">).
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  const response = await fetch(
    `${PHOTOS_PREVIEW_API}?key=${encodeURIComponent(key)}`,
    { next: { revalidate: PRESIGN_CACHE_SECONDS } },
  );
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to resolve media URL" },
      { status: response.status },
    );
  }

  const { url } = (await response.json()) as { url: string };
  return NextResponse.redirect(url, 307);
}
