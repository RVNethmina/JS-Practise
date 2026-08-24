import { Suspense } from "react";
import { getProducts, getRecommendations } from "@/lib/db";
import ProductFilter from "./_components/ProductFilter";
import SearchBox from "./_components/SearchBox";
import Link from "next/link";
import type { Metadata } from "next";

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
    title: "Products",
};

function single(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

function toPage(value: string | undefined): number {
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 ? n : 1;
}

export default async function ProductsPage({ searchParams }: PageProps) {

    const query = await searchParams;

    const q = single(query.q);

    const requestedPage = toPage(single(query.page));
    
    const { items, total, totalPages, page } = await getProducts({
        search: q,
        page: requestedPage,
        pageSize: 6,
    });

    let recommendations: Awaited<ReturnType<typeof getRecommendations>> = [];
    let recsFailed = false;

    try {
        recommendations = await getRecommendations({
            fail: single(query.failrecs) === "1",
        });
    } catch {
        recsFailed = true;
    }

    // 5. Build a pagination href that KEEPS the other params.
    //    Hardcoding `?page=2` would silently wipe ?q=headphones — the classic
    //    pagination bug. Copying the existing params avoids it.
    function pageHref(nextPage: number) {
        const p = new URLSearchParams();
        if (q) p.set("q", q);
        p.set("page", String(nextPage));
        return `/products?${p.toString()}`;
    }

    return (
        <main>
            <h1>Products</h1>
            <p>
                {total} items{q ? ` matching “${q}”` : " in the catalogue"}
            </p>


            <Suspense fallback={<p>Loading search…</p>}>
                <SearchBox />
            </Suspense>

            {items.length === 0 ? (
                <p>No products match that search.</p>
            ) : (
                <ProductFilter products={items} />
            )}

            {/* Version B in action: this section degrades on its own. */}
            <section>
                <h2>Recommended</h2>
                {recsFailed ? (
                    <p>
                        <small>Recommendations are unavailable right now.</small>
                    </p>
                ) : (
                    <ul>
                        {recommendations.map((r) => (
                            <li key={r.id}>{r.name}</li>
                        ))}
                    </ul>
                )}
            </section>

            {/* 6. Previous/Next. Hidden at the ends rather than shown disabled. */}
            <nav>
                {page > 1 && <Link href={pageHref(page - 1)}>← Previous</Link>}{" "}
                <span>
                    Page {page} of {totalPages}
                </span>{" "}
                {page < totalPages && <Link href={pageHref(page + 1)}>Next →</Link>}
            </nav>
        </main>
    );
}