import Link from "next/link";
import { Title } from "@/components/intuitive-ui/(native)/(typography)/title";

const NotFound = () => {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2">
      <Title size="md">
        sorry, this page doesn&apos;t exist. let&apos;s go home.
      </Title>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        ← home
      </Link>
    </div>
  );
};

export default NotFound;
