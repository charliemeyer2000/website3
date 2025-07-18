import { Book, FileText, ShieldAlert } from 'lucide-react';

import { IContentGroup } from '@/app/[topic]/_constants/content-types';

const CONTENT: IContentGroup = {
  title: 'Posts',
  Icon: Book,
  href: '/posts',
  items: [
    {
      title: 'Security in the Vibe-Coding Age — Hacking Series.so',
      href: '/posts/security-in-the-vibe-coding-age-hacking-series-so',
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
