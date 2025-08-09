import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Title } from "@/components/intuitive-ui/(native)/(typography)/title";

import Footer from "@/app/_components/footer";
import TableOfContentsSection from "@/app/_components/table-of-contents-section";

import { IContentGroup } from "./_constants/content-types";
import { filterPrivateContent } from "./_utils/visibility-utils";

interface ITopicPageProps {
  params: Promise<{
    topic: string;
  }>;
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "app", "_content");

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  // Get all directories that contain a content.ts file
  const topics = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((topic) => {
      const contentPath = path.join(contentDir, topic, "content.ts");
      return fs.existsSync(contentPath);
    });

  return topics.map((topic) => ({
    topic,
  }));
}

/**
 * Dynamically loads content configuration for a given topic
 * Checks if the topic has a content.ts file and returns the content group
 */
async function loadTopicContent(topic: string): Promise<IContentGroup | null> {
  // Prevent trying to load content for non-topic files like favicon.ico
  if (!/^[a-zA-Z0-9-_]+$/.test(topic)) {
    // Only allow valid topic slugs (alphanumeric, dash, underscore)
    return null;
  }
  // Optionally, explicitly skip known non-topic files
  if (topic === "favicon.ico") {
    return null;
  }

  try {
    const { default: content } = (await import(
      `@/app/_content/${topic}/content`
    )) as { default: IContentGroup };

    // Validate that the imported content is valid
    if (!content || typeof content !== "object") {
      console.warn(`Invalid content structure for topic: ${topic}`);
      return null;
    }

    return content;
  } catch (error) {
    // Handle module not found and other import errors
    if (error instanceof Error) {
      if (
        error.message.includes("Cannot find module") ||
        error.message.includes("Module not found")
      ) {
        // Silently handle missing content modules
        return null;
      }
      console.error(`Error loading content for topic: ${topic}`, error.message);
    } else {
      console.error(`Unknown error loading content for topic: ${topic}`, error);
    }
    return null;
  }
}

/**
 * Dynamic topic page that displays a table of contents
 * for content found in app/_content/[topic]/content.ts
 */
export default async function TopicPage({ params }: ITopicPageProps) {
  const { topic } = await params;

  // Load the topic content dynamically
  const topicContent = await loadTopicContent(topic);

  // If no content found, show 404
  if (!topicContent) {
    notFound();
  }

  // Filter out private content
  const filteredContent = filterPrivateContent(topicContent, topic);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 pt-8 pb-6 sm:pb-2 md:py-12 md:pb-2">
      <div className="flex grow flex-col gap-12">
        <div className="flex flex-col gap-1">
          <Title level="h1">{topic}</Title>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            ← home
          </Link>
        </div>
        <TableOfContentsSection group={filteredContent} />
      </div>
      <Footer variant="inline" />
    </div>
  );
}
