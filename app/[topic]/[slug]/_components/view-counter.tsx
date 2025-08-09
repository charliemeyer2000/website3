"use client";

import React, { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { createOrUpdateViewCount } from "../_actions/view-actions";

interface IViewCounterProps {
  topic: string;
  slug: string;
}

const ViewCounter: React.FC<IViewCounterProps> = ({ topic, slug }) => {
  const [viewCount, setViewCount] = useState<number>(0);

  const { mutate, isPending } = useMutation({
    mutationKey: ["view-count", topic, slug],
    mutationFn: createOrUpdateViewCount,
    onSuccess: (data) => {
      setViewCount(data.viewCount);
    },
    onError: () => {
      // Silently ignore for UX parity with previous code
    },
  });

  useEffect(() => {
    mutate({ topic, slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, topic]);

  return (
    <div className="text-muted-foreground flex flex-row items-center text-sm">
      <span className="tabular-nums">{isPending ? "—" : viewCount}</span>
      <span className="ml-1">views</span>
    </div>
  );
};

export default ViewCounter;
