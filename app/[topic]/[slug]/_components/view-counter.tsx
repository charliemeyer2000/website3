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
    placeholderData: (previousData) => previousData,
    refetchOnMount: "always",
  });

  return (
    <span
      className="hit-counter"
      style={{ fontSize: "11px", padding: "1px 6px" }}
    >
      {data?.viewCount ?? "---"} views
    </span>
  );
};

export default ViewCounter;
