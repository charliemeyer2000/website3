import {
  Size,
  Variant,
} from '@/components/intuitive-ui/(native)/component-enums';

import Clock from '@/app/_components/clock';

import { MarkdownRenderer } from '../../_components/markdown-renderer';
import { ContentType } from '../../_constants/content-enums';
import { IContentConfig } from '../../_constants/content-types';
import ContentBreadcrumbs from './content-breadcrumbs';
import ShareLinkButton from './share-link-button';

interface IConfigDrivenContentProps {
  topic: string;
  slug: string;
  config: IContentConfig;
  compiledMarkdown: Record<string, string>;
}

/**
 * Config-driven article component with mixed markdown and React components
 */
export const ConfigDrivenContent = ({
  config,
  compiledMarkdown,
}: IConfigDrivenContentProps) => {
  return (
    <article className="relative mx-auto flex w-full max-w-4xl grow flex-col px-4 pt-8 pb-6 sm:pb-2 md:py-12 md:pb-2">
      <div className="flex grow flex-col space-y-8">
        <div>
          <ContentBreadcrumbs />
          <div className="flex flex-row items-start justify-between">
            <div>
              <p>{config.title}</p>
              <p className="text-muted-foreground text-sm">
                {config.description}
              </p>
              {/* <ViewCounter topic={topic} slug={slug} /> */}
            </div>
            <ShareLinkButton className="hidden sm:flex" />
          </div>
        </div>

        {config.content.map((block, i) => {
          if (block.type === ContentType.MARKDOWN) {
            return (
              <MarkdownRenderer
                key={`markdown-${block.id}`}
                content={compiledMarkdown[block.id]}
                className={block?.className}
              />
            );
          }

          if (block.type === ContentType.COMPONENT) {
            const ExampleComponent = block.component as React.ElementType;
            return (
              <div key={`example-${i}`}>
                {/*
                 * Example components must be client components with 'use client' directive
                 */}
                <ExampleComponent />
              </div>
            );
          }

          return null;
        })}

        <ShareLinkButton
          className="animate-in fade-in slide-in-from-bottom-full ease-inout fixed right-4 bottom-4 flex shadow-lg duration-1000 sm:hidden"
          variant={Variant.OUTLINE}
          rounded
          size={Size.LG}
        />
      </div>
      <div className="text-muted-foreground mt-auto flex w-full items-center justify-between pt-12 text-xs sm:text-sm">
        <p>San Francisco, Ca</p>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <p>
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <Clock />
        </div>
      </div>
    </article>
  );
};
