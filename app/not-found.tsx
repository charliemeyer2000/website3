import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2">
      <p className="text-muted-foreground text-lg">
        sorry, this doesn&apos;t exist. let&apos;s go home.
      </p>
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
