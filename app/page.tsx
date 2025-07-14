import { Subtitle } from '@/components/intuitive-ui/(native)/(typography)/subtitle';
import { Title } from '@/components/intuitive-ui/(native)/(typography)/title';

import DashedGridGutter from './_components/dashed-grid-gutter';
import FilteredTableOfContents from './_components/filtered-table-of-contents';
import Footer from './_components/footer';

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-grow flex-col justify-start sm:justify-center">
      <div className="flex flex-col gap-8 p-6 py-24 pb-20 sm:px-16 sm:pb-24">
        <div>
          <Title>charlie meyer</Title>
          <Subtitle balance>infrastructure, ai, llms, and safety.</Subtitle>
        </div>
        <FilteredTableOfContents />
      </div>

      <Footer />

      <DashedGridGutter />
    </main>
  );
}
