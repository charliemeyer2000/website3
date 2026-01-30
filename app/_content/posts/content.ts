import { Book, File, Shield, Server } from "@nsmr/pixelart-react";

import { IContentGroup } from "@/app/[topic]/_constants/content-types";

const CONTENT: IContentGroup = {
  title: "Posts",
  Icon: Book,
  href: "/posts",
  items: [
    {
      title: "Security in the Vibe-Coding Age — Hacking Series.so",
      href: "/posts/security-in-the-vibe-coding-age-hacking-series-so",
      Icon: Shield,
    },
    {
      title: "uvacompute",
      href: "/posts/uvacompute",
      Icon: Server,
    },
    {
      title: "README.md",
      href: "/posts/readme-md",
      Icon: File,
    },
  ],
};

export default CONTENT;
