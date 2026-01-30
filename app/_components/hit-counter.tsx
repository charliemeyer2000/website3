"use client";

import { useState, useEffect } from "react";

export default function HitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(Math.floor(Math.random() * 89999 + 10000));
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "11px",
        color: "#88bbdd",
        fontFamily: "Courier New, monospace",
      }}
    >
      <span className="hit-counter">{count ?? "-----"}</span>
      <br />
      visitors since 2001
    </div>
  );
}
