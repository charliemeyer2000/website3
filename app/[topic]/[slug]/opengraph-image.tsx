import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';

import { getPostData } from '@/app/[topic]/_utils/markdown-utils';
import {
  hasConfigDrivenContent,
  loadConfigDrivenContent,
} from '@/app/[topic]/_utils/content-utils';

export const runtime = 'edge';

export const alt = 'Charlie Meyer - Blog Post';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic, slug } = await params;

  let title = 'Charlie Meyer';
  let description = 'infrastructure, ai, llms, and safety.';

  try {
    // First check for config-driven content
    if (hasConfigDrivenContent(topic, slug)) {
      const { config } = await loadConfigDrivenContent(topic, slug);
      title = config.title || title;
      description = config.description || description;
    } else {
      // Fallback to markdown post
      const post = await getPostData(topic, slug);
      title = post.title || title;
      description = post.description || description;
    }
  } catch {
    // If post not found, return 404
    notFound();
  }

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
    }
  );
}