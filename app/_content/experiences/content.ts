import { Briefcase, Triangle } from "lucide-react";

import CognitionLogo from "@/app/_components/icons/cognition-logo";
import NeoLogo from "@/app/_components/icons/neo-logo";
import PrincipalLogo from "@/app/_components/icons/principal-logo";
import { IContentGroup } from "@/app/[topic]/_constants/content-types";

const CONTENT: IContentGroup = {
  title: "Experiences",
  Icon: Briefcase,
  href: "/experiences",
  items: [
    {
      title: "Cognition - Special Projects Engineer",
      href: "https://cognition.ai/",
      Icon: CognitionLogo,
      external: true,
    },
    {
      title: "Neo Spring in SF Program",
      href: "https://neo.substack.com/p/a-new-way-for-college-students-to",
      Icon: NeoLogo,
      external: true,
    },
    {
      title: "Vercel - Intern",
      href: "https://vercel.com/",
      Icon: Triangle,
      external: true,
    },
    {
      title: "Principal Financial Group - Intern",
      href: "https://www.principal.com/",
      Icon: PrincipalLogo,
      external: true,
    },
  ],
};

export default CONTENT;
