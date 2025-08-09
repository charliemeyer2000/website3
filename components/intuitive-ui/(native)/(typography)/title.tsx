import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { TextLevel as LevelTag, TextTransform } from "./typography-enums";

const titleVariants = cva(
  "tracking-tight break-words font-medium flex items-center mb-2",
  {
    variants: {
      level: {
        h1: "text-4xl [&_svg]:size-7.5",
        h2: "text-3xl",
        h3: "text-2xl [&_svg]:size-5.5",
        h4: "text-xl",
        h5: "text-lg",
        h6: "text-base",
        p: "text-base",
        span: "inline",
      },
      size: {
        xxs: "text-xs",
        xs: "text-sm",
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
        xl: "text-2xl [&_svg]:size-5.5",
        xxl: "text-3xl",
        xxxl: "text-4xl [&_svg]:size-7.5",
      },
      transform: {
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
      },
      srOnly: { true: "sr-only" },
      pretty: { true: "text-pretty" },
      balance: { true: "text-balance" },
    },
    defaultVariants: {
      level: "h1",
      srOnly: false,
      pretty: false,
      balance: false,
    },
  },
);

export interface TitleProps
  extends React.HTMLAttributes<
      HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement
    >,
    VariantProps<typeof titleVariants> {
  /** Icon to display before the title text */
  LeadingIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Icon to display after the title text */
  TrailingIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** For accessibility, mark if this title is a section heading */
  isSectionHeading?: boolean;
  /** For accessibility, override the heading level for screen readers */
  ariaLevel?: number;
  /** Optional href to make the title a link */
  href?: string;
  level?: LevelTag;
  transform?: TextTransform;
}

const Title = React.forwardRef<
  HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement,
  TitleProps
>(
  (
    {
      className,
      level = "h1",
      size,
      transform,
      srOnly,
      pretty,
      LeadingIcon,
      TrailingIcon,
      isSectionHeading = false,
      ariaLevel,
      children,
      balance,
      href,
      ...props
    },
    ref,
  ) => {
    if (balance && pretty) {
      throw new Error(
        "balance and pretty cannot be used together. please use one or the other.",
      );
    }

    // Determine the component to render
    const Comp = level as React.ElementType;

    // Accessibility attributes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessibilityProps: Record<string, any> = {};
    if (isSectionHeading) {
      accessibilityProps.role = "heading";
      accessibilityProps["aria-level"] =
        ariaLevel || (level === "p" ? 2 : undefined);
    }

    const titleClasses = cn(
      titleVariants({
        level,
        size,
        transform,
        srOnly,
        pretty,
        balance,
      }),
      className,
    );

    const titleContent = (
      <>
        {LeadingIcon && (
          <LeadingIcon className="mr-2 inline-block" aria-hidden="true" />
        )}
        {children}
        {TrailingIcon && (
          <TrailingIcon className="ml-2 inline-block" aria-hidden="true" />
        )}
      </>
    );

    // If href is provided, wrap in Link component
    if (href) {
      return (
        <Comp
          className={titleClasses}
          ref={ref}
          {...accessibilityProps}
          {...props}
        >
          <Link
            href={href}
            className="group/title-link no-underline hover:underline"
          >
            {titleContent}
          </Link>
        </Comp>
      );
    }

    // Regular title without link
    return (
      <Comp
        className={titleClasses}
        ref={ref}
        {...accessibilityProps}
        {...props}
      >
        {titleContent}
      </Comp>
    );
  },
);
Title.displayName = "Title";

export { Title, titleVariants };
