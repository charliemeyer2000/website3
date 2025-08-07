"use client";

import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const timeString = time.toLocaleTimeString();

  const formattedDate = time.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <p className="text-muted-foreground text-xs sm:text-sm" id="date-string">
        {formattedDate}
      </p>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            className="border-muted-foreground relative inline-block h-4 w-4 rounded-full border border-[1px]"
            style={
              {
                "--now-h": hours,
                "--now-m": minutes,
                "--now-s": seconds,
              } as React.CSSProperties
            }
          >
            <div
              className="bg-muted-foreground absolute top-1/2 left-1/2 w-[0.75px] rounded-full"
              id="hour-hand"
              style={{
                height: "4px",
                marginTop: "-4px",
                marginLeft: "-0.5px",
                transformOrigin: "center bottom",
                transform: `rotate(${hours * 30 + minutes * 0.5}deg)`,
              }}
            />
            <div
              className="bg-muted-foreground absolute top-1/2 left-1/2 w-[0.75px] rounded-full"
              id="minute-hand"
              style={{
                height: "6px",
                marginTop: "-6px",
                marginLeft: "-0.5px",
                transformOrigin: "center bottom",
                transform: `rotate(${minutes * 6}deg)`,
              }}
            />
            <div
              className="bg-muted-foreground/70 absolute top-1/2 left-1/2 w-[0.75px] rounded-full"
              id="second-hand"
              style={{
                height: "6px",
                marginTop: "-6px",
                marginLeft: "-0.5px",
                transformOrigin: "center bottom",
                transform: `rotate(${seconds * 6}deg)`,
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p id="time-string">{timeString}</p>
        </TooltipContent>
      </Tooltip>
      <script
        dangerouslySetInnerHTML={{
          __html: `(${(() => {
            const time = new Date();
            window.__INITIAL_TIME = time;

            const hours = time.getHours() % 12;
            const minutes = time.getMinutes();
            const seconds = time.getSeconds();

            const formattedDate = time.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const hourHand = document.getElementById("hour-hand");
            const minuteHand = document.getElementById("minute-hand");
            const secondHand = document.getElementById("second-hand");
            const dateStringElement = document.getElementById("date-string");

            if (hourHand && minuteHand && secondHand && dateStringElement) {
              hourHand.style.cssText =
                "height: 4px; margin-top: -4px; margin-left: -0.5px; transform-origin: center bottom; transform: rotate(" +
                (hours * 30 + minutes * 0.5) +
                "deg);";
              minuteHand.style.cssText =
                "height: 6px; margin-top: -6px; margin-left: -0.5px; transform-origin: center bottom; transform: rotate(" +
                minutes * 6 +
                "deg);";
              secondHand.style.cssText =
                "height: 6px; margin-top: -6px; margin-left: -0.5px; transform-origin: center bottom; transform: rotate(" +
                seconds * 6 +
                "deg);";
              dateStringElement.textContent = formattedDate;
            } else {
              console.error("Failed to set clock hands");
              console.log(hourHand, minuteHand, secondHand, dateStringElement);
            }
          }).toString()})()`,
        }}
      />
    </>
  );
}
