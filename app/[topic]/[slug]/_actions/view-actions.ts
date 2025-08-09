"use server";

import { sql } from "drizzle-orm";

import { db } from "@/db";
import { pageViews } from "@/db/db-schema";
import { contentTopicEnum } from "@/db/enums";

interface IViewCountData {
  viewCount: number;
  topic: string;
  slug: string;
}

type ContentTopic = (typeof contentTopicEnum.enumValues)[number];

export async function createOrUpdateViewCount({
  topic,
  slug,
}: {
  topic: string;
  slug: string;
}): Promise<IViewCountData> {
  try {
    if (!contentTopicEnum.enumValues.includes(topic as ContentTopic)) {
      throw new Error("Invalid topic provided");
    }

    const [result] = await db
      .insert(pageViews)
      .values({
        topic: topic as ContentTopic,
        slug,
        viewCount: 1,
      })
      .onConflictDoUpdate({
        target: [pageViews.topic, pageViews.slug],
        set: {
          viewCount: sql`${pageViews.viewCount} + 1`,
          lastViewedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      viewCount: result.viewCount,
      topic: result.topic,
      slug: result.slug,
    };
  } catch (error) {
    console.error("Failed to create/update view count:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update view count",
    );
  }
}
