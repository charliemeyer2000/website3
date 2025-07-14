import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

import { contentTopicEnum } from './enums';

export const pageViews = pgTable(
  'page_views',
  {
    id: serial('id').primaryKey(),
    topic: contentTopicEnum('topic').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    viewCount: integer('view_count').default(0).notNull(),
    lastViewedAt: timestamp('last_viewed_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    topicSlugIdx: index('topic_slug_idx').on(table.topic, table.slug),
    topicSlugUnique: unique('topic_slug_unique').on(table.topic, table.slug),
  }),
);

export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;
