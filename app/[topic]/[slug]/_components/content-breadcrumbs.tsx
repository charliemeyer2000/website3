"use client";

import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { capitalizeText } from "@/lib/utils/text-formatting-utils";

interface IContentBreadcrumbsProps {
  title?: string;
}

const ContentBreadcrumbs = ({ title }: IContentBreadcrumbsProps) => {
  const pathname = usePathname();
  const topic = pathname?.split("/")[1] ?? "";
  const itemSlug = pathname?.slice(1).replace(/\//g, "-") ?? "";

  return (
    <Breadcrumb className="flex flex-row items-center gap-2">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/">Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/${topic}`}>{capitalizeText(topic)}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {title && (
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <span
                className="cursor-default text-sm"
                style={{ viewTransitionName: `vt-item-${itemSlug}` }}
              >
                {title}
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </>
      )}
    </Breadcrumb>
  );
};

export default ContentBreadcrumbs;
