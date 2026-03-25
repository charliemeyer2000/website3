"use client";

import { useEffect, useRef } from "react";
import { type ClassValue } from "clsx";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

interface IMarkdownRendererProps {
  content: string;
  className?: ClassValue;
}

export function MarkdownRenderer({
  content,
  className,
}: IMarkdownRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const copyButtons = ref.current.querySelectorAll(".code-block-copy");
    const handlers: Array<{ btn: Element; handler: () => void }> = [];
    const timers = new Map<Element, ReturnType<typeof setTimeout>>();

    copyButtons.forEach((btn) => {
      const codeBlock = btn.closest(".code-block");
      const handler = () => {
        const prev = timers.get(btn);
        if (prev) clearTimeout(prev);

        const code = codeBlock?.querySelector("pre code")?.textContent || "";
        navigator.clipboard.writeText(code).then(() => {
          // Only toast if icon is currently the copy icon (first click in a burst)
          if (!timers.has(btn) || prev) {
            toast.success("Copied to clipboard", { id: "copy-code" });
          }
          btn.innerHTML = CHECK_ICON;
          timers.set(
            btn,
            setTimeout(() => {
              btn.innerHTML = COPY_ICON;
              timers.delete(btn);
            }, 2000),
          );
        });
      };
      btn.addEventListener("click", handler);
      handlers.push({ btn, handler });
    });

    return () => {
      handlers.forEach(({ btn, handler }) => {
        btn.removeEventListener("click", handler);
      });
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, [content]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        className={cn(
          "[&_h1]:text-foreground [&_h1]:mt-0 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-snug [&_h1]:not-first:mt-11",
          "[&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-2.5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-snug",
          "[&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-snug",
          "[&_p]:text-foreground [&_p]:mb-5",
          "[&_ul]:mb-5 [&_ul]:list-[square] [&_ul]:pl-5 [&_ul]:marker:text-muted-foreground/70",
          "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:marker:text-muted-foreground/70 [&_ol]:marker:tabular-nums",
          "[&_li]:mb-1",
          "[&_blockquote]:border-border [&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-foreground/70",
          "[&_code]:text-foreground [&_code]:bg-muted [&_code]:rounded-sm [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none [&_pre_code]:text-inherit",
          "[&_pre:not(.shiki)]:bg-muted [&_pre:not(.shiki)]:rounded-xl [&_pre:not(.shiki)]:p-4 [&_pre:not(.shiki)]:overflow-x-auto [&_pre:not(.shiki)]:mb-5 [&_pre:not(.shiki)]:text-sm [&_pre:not(.shiki)]:font-mono",
          "[&_a]:text-accent-foreground [&_a]:underline [&_a]:decoration-accent-foreground/30 [&_a]:underline-offset-2 [&_a]:hover:decoration-accent-foreground",
          "[&_img]:my-5 [&_img]:rounded-xl",
          "[&_table]:mb-5 [&_table]:w-full [&_table]:border-collapse",
          "[&_th]:border-border [&_th]:bg-muted [&_th]:border [&_th]:px-4 [&_th]:py-2",
          "[&_td]:border-border [&_td]:border [&_td]:px-4 [&_td]:py-2",
          "[&_hr]:border-border [&_hr]:my-10 [&_hr]:border-t",
          "[&_video]:my-5 [&_video]:rounded-xl",
          "[&_strong]:font-semibold",
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
