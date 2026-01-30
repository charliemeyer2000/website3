import Link from "next/link";

import FilteredTableOfContents from "./_components/filtered-table-of-contents";
import Footer from "./_components/footer";
import HitCounter from "./_components/hit-counter";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center py-6 px-4">
      <div
        style={{
          maxWidth: "780px",
          width: "100%",
          border: "3px outset #88bbdd",
          boxShadow: "4px 4px 0px #003355",
          background: "#ffffee",
          position: "relative",
        }}
      >
        <div
          style={{
            background: "#003366",
            textAlign: "center",
            padding: "20px 16px 16px",
            borderBottom: "2px solid #006699",
          }}
        >
          <h1
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "28px",
              color: "#ffffff",
              margin: "0 0 4px 0",
              letterSpacing: "1px",
            }}
          >
            Charlie Meyer
          </h1>
          <div
            style={{
              fontSize: "12px",
              color: "#88bbdd",
              fontFamily: "'Georgia', serif",
            }}
          >
            ai, llms, math, and interpretability
          </div>
        </div>

        <div style={{ display: "flex", minHeight: "300px" }}>
          <nav
            style={{
              width: "150px",
              flexShrink: 0,
              background: "#eeeedd",
              borderRight: "1px solid #ccccbb",
              padding: "0",
            }}
          >
            <div
              style={{
                background: "#006699",
                color: "#ffffff",
                fontFamily: "'Georgia', serif",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "5px 10px",
              }}
            >
              Navigation
            </div>
            <Link
              href="/"
              style={{
                display: "block",
                padding: "5px 10px",
                fontSize: "12px",
                fontFamily: "'Georgia', serif",
                borderBottom: "1px solid #ddddcc",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
            <Link
              href="/posts"
              style={{
                display: "block",
                padding: "5px 10px",
                fontSize: "12px",
                fontFamily: "'Georgia', serif",
                borderBottom: "1px solid #ddddcc",
                textDecoration: "none",
              }}
            >
              Posts
            </Link>
            <Link
              href="/experiences"
              style={{
                display: "block",
                padding: "5px 10px",
                fontSize: "12px",
                fontFamily: "'Georgia', serif",
                borderBottom: "1px solid #ddddcc",
                textDecoration: "none",
              }}
            >
              Experiences
            </Link>
            <Link
              href="/contact"
              style={{
                display: "block",
                padding: "5px 10px",
                fontSize: "12px",
                fontFamily: "'Georgia', serif",
                borderBottom: "1px solid #ddddcc",
                textDecoration: "none",
              }}
            >
              Contact
            </Link>
          </nav>

          <div style={{ flex: 1, padding: "12px 16px" }}>
            <div
              style={{
                padding: "0 0 10px 0",
                marginBottom: "12px",
                borderBottom: "1px solid #ccccbb",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "15px",
                  color: "#003366",
                  marginBottom: "6px",
                }}
              >
                Welcome
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "#333322",
                }}
              >
                Hi, I&apos;m <b>Charlie Meyer</b>. I&apos;m interested in{" "}
                <b>AI</b>, <b>LLMs</b>, <b>math</b>, and <b>interpretability</b>
                . Feel free to explore my writings, experiences, and get in
                touch.
              </p>
            </div>

            <FilteredTableOfContents />
          </div>
        </div>

        <Footer variant="inline" />
      </div>

      <div style={{ marginTop: "12px" }}>
        <HitCounter />
      </div>
    </main>
  );
}
