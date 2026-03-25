import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeShiki from "@shikijs/rehype";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypeImgSize from "rehype-img-size";
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

const FILE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`;
const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

function wrapCodeBlocks(html: string): string {
  return html.replace(
    /<pre[^>]*class="[^"]*shiki[^"]*"[^>]*>[\s\S]*?<\/pre>/g,
    (preBlock) => {
      const titleMatch = preBlock.match(/data-title="([^"]*)"/);
      const langMatch = preBlock.match(/data-lang="([^"]*)"/);
      const label = titleMatch?.[1] || langMatch?.[1] || "";
      const header = `<div class="code-block-header"><div class="code-block-title">${FILE_ICON}<span>${label}</span></div><button class="code-block-copy" aria-label="Copy code">${COPY_ICON}</button></div>`;
      return `<div class="code-block">${header}${preBlock}</div>`;
    },
  );
}

/**
 * Get a single blog post by ID
 */
export async function getPostData(
  topic: string,
  slug: string,
): Promise<IMarkdownContent> {
  let fileContents: string;
  try {
    const mod = await import(`@/app/_content/${topic}/${slug}.md`);
    fileContents = mod.default;
  } catch {
    throw new Error(`Post not found: ${topic}/${slug}`);
  }

  const matterResult = matter(fileContents);

  // Check if the post is private
  if (matterResult.data.visibility === "private") {
    throw new Error(`Access denied: ${topic}/${slug} is private`);
  }

  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      themes: {
        light: "one-light",
        dark: "one-dark-pro",
      },
      defaultColor: false,
      transformers: [
        {
          name: "add-code-block-props",
          pre(node) {
            const meta =
              (this.options.meta as Record<string, string>)?.__raw || "";
            const titleMatch = meta.match(/title="([^"]*)"/);
            if (titleMatch) {
              node.properties["dataTitle"] = titleMatch[1];
            }
            if (this.options.lang) {
              node.properties["dataLang"] = this.options.lang;
            }
          },
        },
      ],
    })
    .use(rehypeRaw)
    .use(rehypeSlug)
    // Add intrinsic width/height to images to prevent layout shift/scroll jumps
    .use(rehypeImgSize, { dir: "public" })
    // Open external links in new tab
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = wrapCodeBlocks(processedContent.toString());

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
