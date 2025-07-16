import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Charlie Meyer - Blog Post';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({
  params,
  searchParams,
}: {
  params: Promise<{ topic: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const titleParam = searchParamsResolved.title as string | undefined;

  // Use the title from searchParams if available, otherwise generate from slug
  let title = titleParam || 'Charlie Meyer';
  if (!titleParam && slug) {
    title = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const description = 'infrastructure, ai, llms, and safety.';

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
      ...size,
    },
  );
}
