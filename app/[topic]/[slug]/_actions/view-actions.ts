'use server';

import { sql } from 'drizzle-orm';

import type { ServerActionResponse } from '@/hooks/use-server-action';

import { db } from '@/db';
import { pageViews } from '@/db/db-schema';
import { contentTopicEnum } from '@/db/enums';

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
}): Promise<ServerActionResponse<IViewCountData>> {
  try {
    if (!contentTopicEnum.enumValues.includes(topic as ContentTopic)) {
      return {
        status: 'error',
        data: null,
        error: {
          code: 'INVALID_TOPIC',
          message: 'Invalid topic provided',
        },
      };
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
      status: 'success',
      data: {
        viewCount: result.viewCount,
        topic: result.topic,
        slug: result.slug,
      },
      error: null,
    };
  } catch (error) {
    console.error('Failed to create/update view count:', error);
    return {
      status: 'error',
      data: null,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to update view count',
        details: error instanceof Error ? { message: error.message } : {},
      },
    };
  }
}
