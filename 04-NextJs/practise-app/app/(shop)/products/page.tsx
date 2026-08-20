import { Suspense } from "react";
import { getProducts } from "@/lib/db";
import ProductFilter from "./_components/ProductFilter";
import SearchBox from "./_components/SearchBox";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Products",
};

export default async function ProductsPage() {
    const { items, total } = await getProducts({ pageSize: 12 });

    return (
        <main>
            <h1>Products</h1>
            <p>{total} items in the catalogue</p>

            {/* ── PHASE 4, PROBLEM 2 ──────────────────────────────────────────
                SearchBox calls useSearchParams(), so it MUST sit inside a
                <Suspense> boundary or `npm run build` fails.

                Why: the server pre-renders this page into static HTML at build
                time, and at that moment nobody has typed anything — there is no
                ?q= yet. Suspense marks this one spot as "leave a hole, the
                browser will fill it", so the rest of the page can still be
                static.

                `fallback` is what shows in that hole until the browser takes
                over. Keep it roughly the same size as the real thing, or the
                layout jumps.

                Careful: this works fine in `npm run dev` WITHOUT the boundary,
                because dev renders on demand. The failure only appears in a
                production build. Don't trust dev on this one.
               ──────────────────────────────────────────────────────────────── */}
            <Suspense fallback={<p>Loading search…</p>}>
                <SearchBox />
            </Suspense>

            <ProductFilter products={items} />
        </main>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THE SPLIT — this is the pattern to remember

     SERVER (this file)          CLIENT (ProductFilter.tsx)
     ─────────────────           ──────────────────────────
     reads lib/db.ts             holds useState
     can be async                handles onChange
     ships NO code to browser    ships its code to browser
     passes data down as props   filters what it was given

   The page stays a Server Component. Only the interactive leaf is client.
   That's "push the boundary down" — and it's why this page can still be
   async and read the database directly.

   ───────────────────────────────────────────────────────────────────────────
   TWO KINDS OF STATE, SIDE BY SIDE ON ONE PAGE

   This page now renders both approaches at once, on purpose:

     SearchBox      state in the URL       shareable, survives refresh,
                                           readable by the server
     ProductFilter  state in useState      private, instant, gone on refresh

   Right now SearchBox only WRITES to the URL — nothing reads it back yet.
   Phase 6 Problem 5 makes this page read `searchParams` and ask the database
   for matching products, which is the moment the URL approach pays off.
   ═══════════════════════════════════════════════════════════════════════════ */
