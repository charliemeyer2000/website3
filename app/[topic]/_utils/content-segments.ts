export interface IVideoCarouselSlide {
  mediaKey: string;
  title?: string;
  aspect?: string;
}

export type ContentSegment =
  | { type: "html"; html: string }
  | { type: "video-carousel"; slides: IVideoCarouselSlide[]; loop: boolean };

const CAROUSEL_REGEX = /<video-carousel([^>]*)>([\s\S]*?)<\/video-carousel>/g;
const SLIDE_REGEX = /<video-slide\s+([^>]*?)\/?>/g;

function decodeEntities(value: string): string {
  return value
    .replace(/&#x22;|&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x3C;|&lt;/g, "<")
    .replace(/&#x3E;|&gt;/g, ">")
    .replace(/&#x26;|&amp;/g, "&");
}

function getAttribute(attrs: string, name: string): string | undefined {
  const match = attrs.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`));
  return match ? decodeEntities(match[1]) : undefined;
}

/**
 * Splits rendered markdown HTML into plain-HTML segments and embedded
 * <video-carousel> blocks, so interactive React components can be
 * interleaved with dangerouslySetInnerHTML content.
 *
 * Authoring format (inside a markdown file, no blank lines within the block):
 *
 * <video-carousel loop>
 *   <video-slide key="Folder/file.mp4" title="caption" aspect="9/16"></video-slide>
 * </video-carousel>
 *
 * The optional `loop` attribute makes the carousel wrap around infinitely.
 */
export function parseContentSegments(contentHtml: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;

  for (const match of contentHtml.matchAll(CAROUSEL_REGEX)) {
    const html = contentHtml.slice(lastIndex, match.index);
    if (html.trim()) {
      segments.push({ type: "html", html });
    }

    const slides: IVideoCarouselSlide[] = [];
    for (const [, attrs] of match[2].matchAll(SLIDE_REGEX)) {
      const mediaKey = getAttribute(attrs, "key");
      if (!mediaKey) continue;
      slides.push({
        mediaKey,
        title: getAttribute(attrs, "title"),
        aspect: getAttribute(attrs, "aspect"),
      });
    }
    if (slides.length > 0) {
      segments.push({
        type: "video-carousel",
        slides,
        loop: /(^|\s)loop($|\s|=)/.test(match[1]),
      });
    }

    lastIndex = match.index + match[0].length;
  }

  const rest = contentHtml.slice(lastIndex);
  if (rest.trim()) {
    segments.push({ type: "html", html: rest });
  }

  return segments;
}
