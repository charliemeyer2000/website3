'use client';

import { Subtitle } from '@/components/intuitive-ui/(native)/(typography)/subtitle';
import { Title } from '@/components/intuitive-ui/(native)/(typography)/title';

import DashedGridGutter from './_components/dashed-grid-gutter';
import Footer from './_components/footer';
import TableOfContents from './_components/table-of-contents';

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-grow flex-col justify-start sm:justify-center">
      <div className="flex flex-col gap-8 p-6 py-24 pb-20 sm:px-16 sm:pb-24">
        <div>
          <Title>charlie meyer</Title>
          <Subtitle balance>infrastructure, ai, llms, and safety.</Subtitle>
        </div>
        <TableOfContents />
      </div>

      <Footer />

      <DashedGridGutter />
    </main>
  );
}
