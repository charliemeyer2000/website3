import { pgEnum } from 'drizzle-orm/pg-core';

export const contentTopicEnum = pgEnum('content_topic', [
  'posts',
  'experiences',
  'contact',
]);
