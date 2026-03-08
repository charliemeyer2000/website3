"use client";

import { type ClassValue } from "clsx";

import { cn } from "@/lib/utils";

interface IMarkdownStyles {
  h1?: ClassValue;
  h2?: ClassValue;
  h3?: ClassValue;
  p?: ClassValue;
  ul?: ClassValue;
  ol?: ClassValue;
  li?: ClassValue;
  blockquote?: ClassValue;
  pre?: ClassValue;
  code?: ClassValue;
  a?: ClassValue;
  img?: ClassValue;
  table?: ClassValue;
  th?: ClassValue;
  td?: ClassValue;
  hr?: ClassValue;
}

interface IMarkdownRendererProps {
  content: string;
  className?: ClassValue;
  styles?: IMarkdownStyles;
}

export function MarkdownRenderer({
  content,
  className,
}: IMarkdownRendererProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "14px",
          lineHeight: "1.7",
          color: "#333322",
        }}
        className={cn(
          "[&_h1]:mb-4 [&_h1]:border-b-2 [&_h1]:border-[#006699] [&_h1]:pb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-[#003366]",
          "[&_h1]:font-[Comic_Sans_MS,Comic_Sans,cursive]",
          "[&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-[#ccccbb] [&_h2]:pb-1 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-[#006699]",
          "[&_h2]:font-[Comic_Sans_MS,Comic_Sans,cursive]",
          "[&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-[#006699]",
          "[&_h3]:font-[Comic_Sans_MS,Comic_Sans,cursive]",
          "[&_p]:mb-4",
          "[&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc",
          "[&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal",
          "[&_li]:mb-1",
          "[&_blockquote]:mb-4 [&_blockquote]:border-l-[3px] [&_blockquote]:border-l-[#006699] [&_blockquote]:bg-[#f0f0e0] [&_blockquote]:p-3 [&_blockquote]:italic",
          "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:border-2 [&_pre]:border-inset [&_pre]:border-[#ccccbb] [&_pre]:bg-[#f8f8f0] [&_pre]:p-3 [&_pre]:font-[Courier_New,Courier,monospace] [&_pre]:text-xs",
          "[&_code]:bg-[#f0f0e0] [&_code]:px-1 [&_code]:font-[Courier_New,Courier,monospace] [&_code]:text-sm [&_code]:text-[#880000]",
          "[&_a]:text-[#0000cc] [&_a]:underline [&_a]:hover:text-[#ff0000]",
          "[&_img]:my-4 [&_img]:border-2 [&_img]:border-[#ccccbb]",
          "[&_table]:mb-4 [&_table]:w-full [&_table]:border-2 [&_table]:border-outset [&_table]:border-[#999988]",
          "[&_th]:border [&_th]:border-[#999988] [&_th]:bg-[#006699] [&_th]:px-3 [&_th]:py-1 [&_th]:text-sm [&_th]:font-bold [&_th]:text-white",
          "[&_td]:border [&_td]:border-[#ccccbb] [&_td]:px-3 [&_td]:py-1 [&_td]:text-sm",
          "[&_hr]:my-6 [&_hr]:border-none [&_hr]:h-[2px] [&_hr]:bg-gradient-to-r [&_hr]:from-transparent [&_hr]:via-[#006699] [&_hr]:to-transparent",
          "[&_strong]:font-bold",
          "[&_pre]:[&>code]:border-none [&_pre]:[&>code]:bg-transparent [&_pre]:[&>code]:text-[#333322]",
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
