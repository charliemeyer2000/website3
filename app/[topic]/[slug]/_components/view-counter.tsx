'use client';

import React, { useEffect, useState } from 'react';

import useServerAction from '@/hooks/use-server-action';

import { createOrUpdateViewCount } from '../_actions/view-actions';

interface IViewCounterProps {
  topic: string;
  slug: string;
}

const ViewCounter: React.FC<IViewCounterProps> = ({ topic, slug }) => {
  const [viewCount, setViewCount] = useState<number>(0);

  const [trackView, isLoading] = useServerAction({
    action: createOrUpdateViewCount,
    onSuccess: {
      action: ({ response }) => {
        if (response) {
          setViewCount(response.viewCount);
        }
      },
    },
    onError: {
      title: 'Failed to track view',
    },
    options: {
      showToasts: false,
      useGlobalLoader: false,
    },
  });

  useEffect(() => {
    trackView({ topic, slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, topic]);

  return (
    <div className="text-muted-foreground flex flex-row items-center">
      <span className="tabular-nums">{isLoading ? '—' : viewCount}</span>
      <span className="ml-1">views</span>
    </div>
  );
};

export default ViewCounter;
