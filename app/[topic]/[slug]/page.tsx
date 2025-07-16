import type React from 'react';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPostData } from '@/app/[topic]/_utils/markdown-utils';

import {
  hasConfigDrivenContent,
  loadConfigDrivenContent,
} from '../_utils/content-utils';
import { ConfigDrivenContent } from './_components/config-driven-content';
import { MarkdownOnlyContent } from './_components/markdown-only-content';

interface IBlogPostPageProps {
  params: Promise<{
    topic: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: IBlogPostPageProps): Promise<Metadata> {
  const { topic, slug } = await params;

  let title = 'Charlie Meyer';
  let description = 'infrastructure, ai, llms, and safety.';

  try {
    // Check for config-driven content first
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
    // If post not found, generate title from slug
    if (slug) {
      title = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://charliemeyer.xyz/${topic}/${slug}`,
      images: [
        {
          url: `https://charliemeyer.xyz/${topic}/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://charliemeyer.xyz/${topic}/${slug}/opengraph-image`],
    },
  };
}

/**
 * Individual blog post page component
 *
 * Supports two types of content:
 * 1. Config-driven articles (markdown + React components)
 * 2. Traditional single-markdown posts
 */
export default async function ContentPage({ params }: IBlogPostPageProps) {
  const { topic, slug } = await params;

  /*
   * Check for config-driven content first
   * This allows for mixed markdown + React component articles
   */
  if (hasConfigDrivenContent(topic, slug)) {
    const { config, compiledMarkdown } = await loadConfigDrivenContent(
      topic,
      slug,
    );

    return (
      <ConfigDrivenContent
        topic={topic}
        slug={slug}
        config={config}
        compiledMarkdown={compiledMarkdown}
      />
    );
  }

  /*
   * Fallback to traditional single-markdown post
   * This maintains backward compatibility with existing content
   */
  try {
    const post = await getPostData(topic, slug);
    return <MarkdownOnlyContent post={post} />;
  } catch {
    // Post not found, return 404
    notFound();
  }
}
