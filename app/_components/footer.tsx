interface FooterProps {
  className?: string;
  variant?: "absolute" | "inline";
}

export default function Footer({
  className = "",
  variant = "absolute",
}: FooterProps) {
  const footerContent = (
    <div className={className}>
      <hr className="hr-fancy my-3" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 8px",
        }}
      >
        <span
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: "11px",
            color: "#666655",
          }}
        >
          San Francisco, Ca
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "#888877",
            fontFamily: "Courier New, monospace",
          }}
        >
          &#169; 2026 Charlie Meyer
        </span>
      </div>
    </div>
  );

  if (variant === "absolute") {
    return (
      <div className="absolute right-0 bottom-0 left-0 px-4 pb-2">
        {footerContent}
      </div>
    );
  }

  return <div className="mt-auto pt-8">{footerContent}</div>;
}
