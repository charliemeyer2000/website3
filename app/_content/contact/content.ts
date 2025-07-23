import { AtSign, Github, Linkedin, Mail, Twitter } from 'lucide-react';

import { IContentGroup } from '@/app/[topic]/_constants/content-types';

const CONTENT: IContentGroup = {
  title: 'Contact',
  Icon: AtSign,
  href: '/contact',
  items: [
    {
      title: 'Email',
      href: 'mailto:charlie@charliemeyer.xyz',
      Icon: Mail,
    },
    {
      title: 'LinkedIn',
      href: 'https://www.linkedin.com/in/charlie-meyer-loves-you/',
      Icon: Linkedin,
      external: true,
    },
    {
      title: 'Twitter',
      href: 'https://x.com/charlie_meyer_',
      Icon: Twitter,
      external: true,
    },
    {
      title: 'GitHub',
      href: 'https://github.com/charliemeyer2000',
      Icon: Github,
    },
  ],
};

export default CONTENT;
