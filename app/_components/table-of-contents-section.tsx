import Link from "next/link";

import { IContentGroup } from "../[topic]/_constants/content-types";

interface ITableOfContentsSectionProps {
  group: IContentGroup;
  href?: string;
}

const TableOfContentsSection = ({
  group,
  href,
}: ITableOfContentsSectionProps) => {
  return (
    <div>
      <div
        style={{
          background: "#006699",
          color: "#ffffff",
          padding: "5px 10px",
          fontFamily: "'Georgia', serif",
          fontSize: "13px",
          fontWeight: "bold",
          borderBottom: "1px solid #004477",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {href ? (
          <Link
            href={href}
            style={{ color: "#ffffff", textDecoration: "none" }}
          >
            {group.title}
          </Link>
        ) : (
          <span>{group.title}</span>
        )}
        <group.Icon style={{ width: 14, height: 14, color: "#aaddff" }} />
      </div>
      <div style={{ padding: "4px 10px" }}>
        {group.items.map((item, i) => (
          <div
            key={item.title}
            style={{
              padding: "4px 0",
              borderBottom:
                i < group.items.length - 1 ? "1px solid #eeeedd" : "none",
            }}
          >
            <Link
              href={item.href}
              target={item.external ? "_blank" : "_self"}
              rel={item.external ? "noopener noreferrer" : undefined}
              style={{
                fontSize: "13px",
                textDecoration: "underline",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <item.Icon
                style={{
                  width: 12,
                  height: 12,
                  color: "#006699",
                  flexShrink: 0,
                }}
              />
              <span>{item.title}</span>
            </Link>
            {item.description && (
              <p
                style={{
                  fontSize: "11px",
                  color: "#666655",
                  margin: "2px 0 0 18px",
                }}
              >
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOfContentsSection;
