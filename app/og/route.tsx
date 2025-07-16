import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Charlie Meyer';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '80px 120px',
            position: 'relative',
            fontFamily: 'Geist',
          }}
        >
          {/* Dashed grid lines - crossing the entire image */}
          <div
            style={{
              position: 'absolute',
              top: '60px',
              left: '0',
              width: '1200px',
              height: '0px',
              borderTop: '1px dashed #ebebeb',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              left: '0',
              width: '1200px',
              height: '0px',
              borderTop: '1px dashed #ebebeb',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '80px',
              width: '0px',
              height: '630px',
              borderLeft: '1px dashed #ebebeb',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '0',
              right: '80px',
              width: '0px',
              height: '630px',
              borderLeft: '1px dashed #ebebeb',
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxWidth: '960px',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 500,
                color: '#000000',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                fontFamily: 'Geist',
                textAlign: 'left',
              }}
            >
              {title
                .split(' ')
                .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
                .join(' ')}
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 400,
                color: '#6b7280',
                lineHeight: 1.2,
                fontFamily: 'Geist',
                textAlign: 'left',
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
