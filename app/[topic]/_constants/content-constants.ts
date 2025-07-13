import CONTACT_CONTENT from '@/app/_content/contact/content';
import EXPERIENCES_CONTENT from '@/app/_content/experiences/content';
import POSTS_CONTENT from '@/app/_content/posts/content';

import { IContentGroup } from './content-types';

export const TABLE_OF_CONTENTS_ITEMS: IContentGroup[] = [
  POSTS_CONTENT,
  EXPERIENCES_CONTENT,
  CONTACT_CONTENT,
];
