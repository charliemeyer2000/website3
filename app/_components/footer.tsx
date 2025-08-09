import Clock from "./clock";

interface FooterProps {
  className?: string;
  variant?: "absolute" | "inline";
}

export default function Footer({
  className = "",
  variant = "absolute",
}: FooterProps) {
  if (variant === "absolute") {
    // Original absolute positioning for main page
    return (
      <>
        <div
          className={`absolute bottom-6 left-6 sm:bottom-2 sm:left-16 ${className}`}
        >
          <p className="text-muted-foreground text-xs sm:text-sm">
            San Francisco, Ca
          </p>
        </div>

        <div
          className="absolute right-6 bottom-6 flex items-center gap-1.5 sm:right-16 sm:bottom-2 sm:gap-2"
          suppressHydrationWarning
        >
          <Clock />
        </div>
      </>
    );
  }

  // Inline flexbox variant for topic pages
  return (
    <div
      className={`text-muted-foreground mt-auto flex w-full items-center justify-between pt-12 text-xs sm:text-sm ${className}`}
    >
      <p>San Francisco, Ca</p>
      <div
        className="flex items-center gap-1.5 sm:gap-2"
        suppressHydrationWarning
      >
        <Clock />
      </div>
    </div>
  );
}
