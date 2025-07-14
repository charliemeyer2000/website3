'use client';

import { useEffect, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Clock() {
  const [time, setTime] = useState(new Date());

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

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          className="border-muted-foreground relative inline-block h-4 w-4 rounded-full border border-[1px]"
          style={
            {
              '--now-h': hours,
              '--now-m': minutes,
              '--now-s': seconds,
            } as React.CSSProperties
          }
        >
          <div
            className="bg-muted-foreground absolute top-1/2 left-1/2 w-[0.75px] rounded-full"
            style={{
              height: '4px',
              marginTop: '-4px',
              marginLeft: '-0.5px',
              transformOrigin: 'center bottom',
              transform: `rotate(${hours * 30 + minutes * 0.5}deg)`,
            }}
          />
          <div
            className="bg-muted-foreground absolute top-1/2 left-1/2 w-[0.75px] rounded-full"
            style={{
              height: '6px',
              marginTop: '-6px',
              marginLeft: '-0.5px',
              transformOrigin: 'center bottom',
              transform: `rotate(${minutes * 6}deg)`,
            }}
          />
          <div
            className="bg-muted-foreground/70 absolute top-1/2 left-1/2 w-[0.75px] rounded-full"
            style={{
              height: '6px',
              marginTop: '-6px',
              marginLeft: '-0.5px',
              transformOrigin: 'center bottom',
              transform: `rotate(${seconds * 6}deg)`,
            }}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{timeString}</p>
      </TooltipContent>
    </Tooltip>
  );
}
