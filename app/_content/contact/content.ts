import { At, Github, Contact, Mail, Message } from "@nsmr/pixelart-react";

import { IContentGroup } from "@/app/[topic]/_constants/content-types";

const CONTENT: IContentGroup = {
  title: "Contact",
  Icon: At,
  href: "/contact",
  items: [
    {
      title: "Email",
      href: "mailto:charlie@charliemeyer.xyz",
      Icon: Mail,
    },
    {
      title: "LinkedIn",
      href: "https://www.linkedin.com/in/charlie-meyer-loves-you/",
      Icon: Contact,
      external: true,
    },
    {
      title: "Twitter",
      href: "https://x.com/charlie_meyer_",
      Icon: Message,
      external: true,
    },
    {
      title: "GitHub",
      href: "https://github.com/charliemeyer2000",
      Icon: Github,
      external: true,
    },
  ],
};

export default CONTENT;
