import { Book, FileText, ShieldAlert } from 'lucide-react';

import { IContentGroup } from '@/app/[topic]/_constants/content-types';

const CONTENT: IContentGroup = {
  title: 'Posts',
  Icon: Book,
  href: '/posts',
  items: [
    {
      title: 'Security in the vibe-coding age—how I hacked Series.so',
      href: '/posts/series-so-security-vulnerability',
      Icon: ShieldAlert,
    },
    {
      title: 'README.md',
      href: '/posts/readme-md',
      Icon: FileText,
    },
  ],
};

export default CONTENT;
