import type React from "react";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPostData, getAllPosts } from "@/app/[topic]/_utils/markdown-utils";

import { MarkdownOnlyContent } from "./_components/markdown-only-content";

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

  let title = "Charlie Meyer";
  let description = "infrastructure, ai, llms, and safety.";

  try {
    const post = await getPostData(topic, slug);
    title = post.title || title;
    description = post.description || description;
  } catch {
    // If post not found, generate title from slug
    if (slug) {
      title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  }

  // Use environment variables for flexible URL handling
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "https://charliemeyer.xyz";

  // Generate OpenGraph image URL with parameters
  const ogParams = new URLSearchParams({
    title,
    description,
  });
  const ogImageUrl = `${baseUrl}/og?${ogParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/${topic}/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  const params = [];

  // Get all markdown posts
  const posts = await getAllPosts();
  for (const post of posts) {
    params.push({
      topic: post.topic,
      slug: post.slug,
    });
  }

  return params;
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

  try {
    const post = await getPostData(topic, slug);
    return <MarkdownOnlyContent post={post} />;
  } catch {
    // Post not found, return 404
    notFound();
  }
}
