import { Subtitle } from "@/components/intuitive-ui/(native)/(typography)/subtitle";
import { Title } from "@/components/intuitive-ui/(native)/(typography)/title";

import FilteredTableOfContents from "./_components/filtered-table-of-contents";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 sm:py-24">
        <header className="mb-10">
          <Title className="mb-1">charlie meyer</Title>
          <Subtitle balance>infrastructure, ai, llms, and safety.</Subtitle>
        </header>
        <FilteredTableOfContents />
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 sm:px-8">
        <Footer variant="inline" />
      </div>
    </main>
  );
}
