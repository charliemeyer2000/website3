import {
  Size,
  Variant,
} from "@/components/intuitive-ui/(native)/component-enums";

import Footer from "@/app/_components/footer";

import { MarkdownRenderer } from "../../_components/markdown-renderer";
import { IMarkdownContent } from "../../_utils/markdown-utils";
import ContentBreadcrumbs from "./content-breadcrumbs";
import ShareLinkButton from "./share-link-button";
import ViewCounter from "./view-counter";

interface IMarkdownOnlyContentProps {
  post: IMarkdownContent;
}

/**
 * Traditional single-markdown blog post component
 */
export const MarkdownOnlyContent = ({ post }: IMarkdownOnlyContentProps) => {
  return (
    <article className="relative mx-auto flex w-full max-w-4xl grow flex-col px-4 pt-8 pb-6 sm:pb-2 md:py-12 md:pb-2">
      <div className="flex grow flex-col gap-12">
        <div className="flex w-full flex-row items-start justify-between">
          <ContentBreadcrumbs title={post.title} />
          <div className="flex flex-row items-center gap-2">
            <ViewCounter topic={post.topic} slug={post.slug} />
            <ShareLinkButton className="hidden sm:flex" />
          </div>
        </div>

        <MarkdownRenderer content={post.contentHtml} />

        <ShareLinkButton
          className="animate-in fade-in slide-in-from-bottom-full ease-inout fixed right-4 bottom-4 flex shadow-lg duration-1000 sm:hidden"
          variant={Variant.OUTLINE}
          rounded
          size={Size.LG}
        />
      </div>
      <Footer variant="inline" />
    </article>
  );
};
