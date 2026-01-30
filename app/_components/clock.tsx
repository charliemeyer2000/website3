"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __INITIAL_TIME: Date;
  }
}

function getInitialTime(): Date {
  if (typeof window !== "undefined" && window.__INITIAL_TIME) {
    return new Date(window.__INITIAL_TIME);
  }
  return new Date();
}

export default function Clock() {
  const [time, setTime] = useState(getInitialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString();

  const formattedDate = time.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <span
      suppressHydrationWarning
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "11px",
        color: "#666655",
      }}
    >
      <span id="date-string" suppressHydrationWarning>
        {formattedDate}
      </span>
      {" | "}
      <span
        className="hit-counter"
        style={{ fontSize: "11px", padding: "1px 4px" }}
        id="time-string"
        suppressHydrationWarning
      >
        {timeString}
      </span>
      <script
        dangerouslySetInnerHTML={{
          __html: `(${(() => {
            const time = new Date();
            window.__INITIAL_TIME = time;

            const formattedDate = time.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const dateStringElement = document.getElementById("date-string");
            const timeStringElement = document.getElementById("time-string");

            if (dateStringElement) {
              dateStringElement.textContent = formattedDate;
            }
            if (timeStringElement) {
              timeStringElement.textContent = time.toLocaleTimeString();
            }
          }).toString()})()`,
        }}
      />
    </span>
  );
}
