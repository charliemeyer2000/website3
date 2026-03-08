import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          border: "3px outset #88bbdd",
          boxShadow: "4px 4px 0px #003355",
          background: "#ffffee",
        }}
      >
        <div
          style={{
            background: "#003366",
            padding: "12px 16px",
            borderBottom: "2px solid #006699",
          }}
        >
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "20px",
              color: "#ffffff",
              margin: 0,
            }}
          >
            404 - Page Not Found
          </h1>
        </div>
        <div style={{ padding: "20px" }}>
          <p
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "14px",
              color: "#333322",
              marginBottom: "16px",
            }}
          >
            Sorry, this page doesn&apos;t exist on this server.
          </p>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              display: "inline-block",
              padding: "4px 16px",
              border: "2px outset #cccccc",
              background: "#eeeedd",
              fontFamily: "'Georgia', serif",
              textDecoration: "none",
            }}
          >
            &lt; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
