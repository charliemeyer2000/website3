import { Briefcase, Building2, Code2, Dog, Triangle } from 'lucide-react';

import { IContentGroup } from '@/app/[topic]/_constants/content-types';

const CONTENT: IContentGroup = {
  title: 'Experiences',
  Icon: Briefcase,
  items: [
    {
      title: 'Neo Spring in SF Program',
      href: 'https://neo.substack.com/p/a-new-way-for-college-students-to',
      Icon: Code2,
      external: true,
    },
    {
      title: 'Vercel - Intern',
      href: 'https://vercel.com/',
      Icon: Triangle,
      external: true,
    },
    {
      title: 'Principal Financial Group - Intern',
      href: 'https://www.principal.com/',
      Icon: Building2,
      external: true,
    },
    {
      title: 'Scenthound - Intern',
      href: 'https://scenthound.com/',
      Icon: Dog,
      external: true,
    },
  ],
};

export default CONTENT;
