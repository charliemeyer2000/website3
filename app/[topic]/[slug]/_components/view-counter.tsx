'use client';

import React, { useEffect, useState } from 'react';

interface IViewCounterProps {
  topic: string;
  slug: string;
}

const ViewCounter: React.FC<IViewCounterProps> = ({ topic, slug }) => {
  const [views] = useState<number>(0);

  useEffect(() => {
    // Temporarily disabled - will implement API endpoint later
    return;
  }, [slug, topic]);

  return (
    <div className="text-muted-foreground flex flex-row items-center">
      {views === 0 ? (
        <div className="bg-muted-foreground/50 mx-1 h-4 w-6 animate-pulse rounded" />
      ) : (
        views
      )}{' '}
      views
    </div>
  );
};

export default ViewCounter;
