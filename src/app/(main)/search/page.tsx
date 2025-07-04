import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import SearchResults from "./SearchResult";

// ✅ Updated interface for Next.js 15 - searchParams is now a Promise
interface PageProps {
  searchParams: Promise<{ q: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  // ✅ Await searchParams in Next.js 15
  const { q } = await searchParams;

  return {
    title: `Search results for "${q}"`,
  };
}

export default async function Page({ searchParams }: PageProps) {
  // ✅ Await searchParams in Next.js 15
  const { q } = await searchParams;

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Search results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
