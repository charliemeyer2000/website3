import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

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

async function loadTopicContent(topic: string): Promise<IContentGroup | null> {
  if (!/^[a-zA-Z0-9-_]+$/.test(topic)) {
    return null;
  }
  if (topic === "favicon.ico") {
    return null;
  }

  try {
    const { default: content } = (await import(
      `@/app/_content/${topic}/content`
    )) as { default: IContentGroup };

    if (!content || typeof content !== "object") {
      console.warn(`Invalid content structure for topic: ${topic}`);
      return null;
    }

    return content;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("Cannot find module") ||
        error.message.includes("Module not found")
      ) {
        return null;
      }
      console.error(`Error loading content for topic: ${topic}`, error.message);
    } else {
      console.error(`Unknown error loading content for topic: ${topic}`, error);
    }
    return null;
  }
}

export default async function TopicPage({ params }: ITopicPageProps) {
  const { topic } = await params;

  const topicContent = await loadTopicContent(topic);

  if (!topicContent) {
    notFound();
  }

  const filteredContent = filterPrivateContent(topicContent, topic);

  return (
    <div className="min-h-dvh flex flex-col items-center py-6 px-4">
      <div
        style={{
          maxWidth: "780px",
          width: "100%",
          border: "3px outset #88bbdd",
          boxShadow: "4px 4px 0px #003355",
          background: "#ffffee",
        }}
      >
        <div
          style={{
            background: "#003366",
            padding: "14px 16px",
            borderBottom: "2px solid #006699",
          }}
        >
          <h1
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "22px",
              color: "#ffffff",
              margin: 0,
            }}
          >
            {topic}
          </h1>
        </div>

        <div
          style={{
            background: "#eeeedd",
            padding: "6px 12px",
            borderBottom: "1px solid #ccccbb",
            fontSize: "12px",
            fontFamily: "'Georgia', serif",
          }}
        >
          <Link href="/" style={{ fontSize: "12px" }}>
            Home
          </Link>
          {" > "}
          <span style={{ color: "#666655" }}>{topic}</span>
        </div>

        <div style={{ padding: "16px" }}>
          <TableOfContentsSection group={filteredContent} />
        </div>

        <Footer variant="inline" />
      </div>
    </div>
  );
}
