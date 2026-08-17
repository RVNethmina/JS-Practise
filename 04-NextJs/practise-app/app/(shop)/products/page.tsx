import { getProducts } from "@/lib/db";
import ProductFilter from "./_components/ProductFilter";
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
   ═══════════════════════════════════════════════════════════════════════════ */
