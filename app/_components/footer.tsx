'use client';

import Clock from './clock';

export default function Footer() {
  return (
    <>
      <div className="absolute bottom-6 left-6 sm:bottom-2 sm:left-16">
        <p className="text-muted-foreground text-xs sm:text-sm">
          San Francisco, Ca
        </p>
      </div>

      <div className="absolute right-6 bottom-6 flex items-center gap-1.5 sm:right-16 sm:bottom-2 sm:gap-2">
        <p className="text-muted-foreground text-xs sm:text-sm">
          {new Date().getFullYear()}
        </p>
        <Clock />
      </div>
    </>
  );
}
