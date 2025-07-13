import { pgEnum } from 'drizzle-orm/pg-core';

// Content topics based on existing _content directory structure
// These should match the folder names in app/_content/
export const contentTopicEnum = pgEnum('content_topic', [
  'posts',
  'docs',
  'hooks',
  'patterns',
  'experiences',
  'contact',
]);

// View source tracking for analytics
export const viewSourceEnum = pgEnum('view_source', [
  'direct',
  'search',
  'social',
  'referral',
  'unknown',
]);
