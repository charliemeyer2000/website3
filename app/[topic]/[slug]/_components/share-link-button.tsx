"use client";

import { Check, Link as LinkPixel } from "@nsmr/pixelart-react";

import { usePathname } from "next/navigation";

import { Button, ButtonProps } from "@/components/ui/button";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import { cn } from "@/lib/utils";

const createShareableBlogLink = (pathname: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${pathname}`;
};

const ShareLinkButton = ({ className, ...props }: ButtonProps) => {
  const pathname = usePathname();
  const { isCopied, handleCopy } = useCopyToClipboard(
    createShareableBlogLink(pathname),
    {
      showToast: false,
    },
  );
  return (
    <Button
      className={cn(className)}
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      {...props}
    >
      {isCopied ? <Check /> : <LinkPixel />}
    </Button>
  );
};

export default ShareLinkButton;
