import { ArrowLeft } from 'lucide-react';

import Link from 'next/link';

import { Button, ButtonGroup } from '@/components/intuitive-ui/(native)/button';
import { Size } from '@/components/intuitive-ui/(native)/component-enums';

const NotFound = () => {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2">
      <p className="text-muted-foreground text-lg">
        sorry, this doesn&apos;t exist. let&apos;s go home.
      </p>
      <ButtonGroup aria-label="not-found-actions">
        <Link href="/">
          <Button size={Size.XXS} LeadingIcon={ArrowLeft}>
            home
          </Button>
        </Link>
      </ButtonGroup>
    </div>
  );
};

export default NotFound;
