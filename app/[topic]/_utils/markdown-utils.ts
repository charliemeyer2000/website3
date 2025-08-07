import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";

export interface IMarkdownContent {
  topic: string;
  slug: string;
  title: string;
  description?: string;
  contentHtml: string;
  visibility?: string;
}

const postsDirectory = path.join(process.cwd(), "app", "_content");

/**
 * Get a single blog post by ID
 */
export async function getPostData(
  topic: string,
  slug: string,
): Promise<IMarkdownContent> {
  const fullPath = path.join(postsDirectory, `${topic}/${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${topic}/${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  // Check if the post is private
  if (matterResult.data.visibility === "private") {
    throw new Error(`Access denied: ${topic}/${slug} is private`);
  }

  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    topic,
    slug,
    contentHtml,
    ...matterResult.data,
  } as IMarkdownContent;
}

/**
 * Check if a markdown post is private without processing its content
 */
export function isPostPrivate(topic: string, slug: string): boolean {
  const fullPath = path.join(postsDirectory, `${topic}/${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return false;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  return matterResult.data.visibility === "private";
}

/**
 * Get all blog posts for static generation
 */
export async function getAllPosts(): Promise<
  Array<{ topic: string; slug: string }>
> {
  const posts: Array<{ topic: string; slug: string }> = [];

  if (!fs.existsSync(postsDirectory)) {
    return posts;
  }

  const topics = fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const topic of topics) {
    const topicPath = path.join(postsDirectory, topic);
    const files = fs
      .readdirSync(topicPath)
      .filter((file) => file.endsWith(".md"));

    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      // Skip private posts in static generation
      if (!isPostPrivate(topic, slug)) {
        posts.push({ topic, slug });
      }
    }
  }

  return posts;
}
