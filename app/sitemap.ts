import { existsSync, readdirSync } from 'fs';
import type { MetadataRoute } from 'next';
import { join } from 'path';

import { filterPrivateContent } from '@/app/[topic]/_utils/visibility-utils';

const BASE_URL = 'https://charliemeyer.xyz';

/**
 * Get all valid topic directories from _content folder
 */
function getTopics(): string[] {
  const contentDir = join(process.cwd(), 'app', '_content');
  const topics: string[] = [];

  try {
    const entries = readdirSync(contentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const topicPath = join(contentDir, entry.name);
        const contentFile = join(topicPath, 'content.ts');

        // Only include topics that have a content.ts file
        if (existsSync(contentFile)) {
          topics.push(entry.name);
        }
      }
    }
  } catch (error) {
    console.error('Error reading content directory:', error);
  }

  return topics;
}

/**
 * Get all content items (slugs) for a given topic
 */
async function getTopicSlugs(topic: string): Promise<string[]> {
  try {
    const { default: content } = await import(
      `@/app/_content/${topic}/content`
    );

    // Filter out private content
    const filteredContent = filterPrivateContent(content, topic);
    const slugs: string[] = [];

    if (filteredContent.items) {
      for (const item of filteredContent.items) {
        // Only include internal links (not external ones)
        if (item.href && !item.external && item.href.startsWith('/')) {
          // Extract slug from href (e.g., "/posts/readme" -> "readme")
          const slug = item.href.split('/').pop();
          if (slug) {
            slugs.push(slug);
          }
        }
      }
    }

    return slugs;
  } catch (error) {
    console.error(`Error loading content for topic ${topic}:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  // Static routes
  urls.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  });

  urls.push({
    url: `${BASE_URL}/design`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  });

  // Dynamic routes
  const topics = getTopics();

  for (const topic of topics) {
    // Add topic page
    urls.push({
      url: `${BASE_URL}/${topic}`,
      lastModified: new Date(),
      changeFrequency: topic === 'posts' ? 'weekly' : 'monthly',
      priority: topic === 'posts' ? 0.8 : 0.7,
    });

    // Add all slugs for this topic
    const slugs = await getTopicSlugs(topic);

    for (const slug of slugs) {
      urls.push({
        url: `${BASE_URL}/${topic}/${slug}`,
        lastModified: new Date(),
        changeFrequency: topic === 'posts' ? 'monthly' : 'yearly',
        priority: topic === 'posts' ? 0.9 : 0.8,
      });
    }
  }

  return urls;
}
