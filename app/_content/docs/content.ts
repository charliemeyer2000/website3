import { Book, BookOpen } from 'lucide-react';

import { IContentGroup } from '@/app/[topic]/_constants/content-types';

const CONTENT: IContentGroup = {
  title: 'Posts',
  Icon: Book,
  items: [
    {
      title: 'Security in the vibe-coding age—how I hacked Series.so',
      href: '/docs/getting-started',
      Icon: BookOpen,
    },
  ],
};

export default CONTENT;
