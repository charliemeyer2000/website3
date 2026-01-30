import Clock from "./clock";

interface FooterProps {
  className?: string;
  variant?: "absolute" | "inline";
}

export default function Footer({
  className = "",
  variant = "absolute",
}: FooterProps) {
  const footerContent = (
    <div className={`text-center ${className}`}>
      <hr className="hr-fancy my-3" />
      <table
        style={{ width: "100%", borderCollapse: "collapse" }}
        role="presentation"
      >
        <tbody>
          <tr>
            <td style={{ textAlign: "left", padding: "4px 8px" }}>
              <span
                style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: "11px",
                  color: "#666655",
                }}
              >
                San Francisco, Ca
              </span>
            </td>
            <td style={{ textAlign: "center", padding: "4px 8px" }}>
              <span style={{ fontSize: "11px", color: "#666655" }}>
                Best viewed with Netscape Navigator 4.0 at 800x600
              </span>
            </td>
            <td
              style={{ textAlign: "right", padding: "4px 8px" }}
              suppressHydrationWarning
            >
              <Clock />
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          fontSize: "10px",
          color: "#888877",
          marginTop: "4px",
          fontFamily: "Courier New, monospace",
        }}
      >
        &#169; 2025 Charlie Meyer | Made with &#9829; and HTML
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
