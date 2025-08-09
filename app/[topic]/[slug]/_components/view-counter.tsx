"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";

import { createOrUpdateViewCount } from "../_actions/view-actions";

interface IViewCounterProps {
  topic: string;
  slug: string;
}

const ViewCounter: React.FC<IViewCounterProps> = ({ topic, slug }) => {
  const { data } = useQuery({
    queryKey: ["view-count", topic, slug],
    queryFn: () => createOrUpdateViewCount({ topic, slug }),
    // Show cached data immediately, then always run the query on mount to increment & refresh
    placeholderData: (previousData) => previousData,
    refetchOnMount: "always",
  });

  return (
    <div className="text-muted-foreground flex flex-row items-center text-sm">
      <span className="tabular-nums">{data?.viewCount ?? "—"}</span>
      <span className="ml-1">views</span>
    </div>
  );
};

export default ViewCounter;
