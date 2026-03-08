import Link from "next/link";

import { Button } from "@/components/ui/button";

import Footer from "@/app/_components/footer";

import { MarkdownRenderer } from "../../_components/markdown-renderer";
import { IMarkdownContent } from "../../_utils/markdown-utils";
import ContentBreadcrumbs from "./content-breadcrumbs";
import ShareLinkButton from "./share-link-button";
import ViewCounter from "./view-counter";

interface IMarkdownOnlyContentProps {
  post: IMarkdownContent;
}

export const MarkdownOnlyContent = ({ post }: IMarkdownOnlyContentProps) => {
  return (
    <div className="min-h-dvh flex flex-col items-center py-6 px-4">
      <article
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
              fontSize: "18px",
              color: "#ffffff",
              margin: 0,
            }}
          >
            {post.title}
          </h1>
        </div>

        <div
          style={{
            background: "#eeeedd",
            padding: "6px 12px",
            borderBottom: "1px solid #ccccbb",
            fontSize: "12px",
            fontFamily: "'Georgia', serif",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ContentBreadcrumbs title={post.title} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ViewCounter topic={post.topic} slug={post.slug} />
            <ShareLinkButton className="hidden sm:flex" />
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <MarkdownRenderer content={post.contentHtml} />
        </div>

        <div
          style={{
            padding: "8px 12px",
            background: "#eeeedd",
            borderTop: "1px solid #ccccbb",
            fontSize: "12px",
          }}
        >
          <Link href="/" style={{ fontSize: "12px" }}>
            &lt; Back to Home
          </Link>
        </div>

        <Button
          className="animate-in fade-in slide-in-from-bottom-full ease-inout fixed right-4 bottom-4 z-40 flex shadow-lg duration-1000 sm:hidden"
          variant="outline"
          size="lg"
          asChild
        >
          <ShareLinkButton />
        </Button>

        <Footer variant="inline" />
      </article>
    </div>
  );
};
