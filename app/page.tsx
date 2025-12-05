import { Subtitle } from "@/components/intuitive-ui/(native)/(typography)/subtitle";
import { Title } from "@/components/intuitive-ui/(native)/(typography)/title";

import DashedGridGutter from "./_components/dashed-grid-gutter";
import FilteredTableOfContents from "./_components/filtered-table-of-contents";
import Footer from "./_components/footer";
import ForestFireBackground from "./_components/forest-fire-background";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-grow flex-col justify-start sm:justify-center">
      <ForestFireBackground />
      <div className="flex flex-col gap-8 p-6 py-24 pb-20 sm:px-16 sm:pb-24">
        <div>
          <Title>charlie meyer</Title>
          <Subtitle balance>ai, llms, math, and interpretability.</Subtitle>
        </div>
        <FilteredTableOfContents />
      </div>

      <Footer />

      <DashedGridGutter />
    </main>
  );
}
