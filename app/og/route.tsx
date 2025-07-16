import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Charlie Meyer';
    const description =
      searchParams.get('description') ||
      'infrastructure, ai, llms, and safety.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            padding: '80px 120px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '960px',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 600,
                color: '#1a1a1a',
                lineHeight: 1.2,
                marginBottom: '32px',
                fontFamily: 'Inter',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 400,
                color: '#6b7280',
                lineHeight: 1.3,
                fontFamily: 'Inter',
              }}
            >
              {description}
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 400,
                color: '#9ca3af',
                marginTop: '48px',
                fontFamily: 'Inter',
              }}
            >
              charlie meyer
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
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
