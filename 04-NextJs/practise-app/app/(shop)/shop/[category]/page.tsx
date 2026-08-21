import { getProducts, getCategory } from "@/lib/db";
import { notFound } from "next/navigation";
import type { ProductSort } from "@/lib/types";
import Link from "next/link";

type PageProps = {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// A URL key can repeat: ?sort=a&sort=b arrives as ["a","b"]. This picks the first.
// Job: turn 3 possible shapes (string | array | undefined) into 2 (string | undefined).
// NOT injection protection — it never cleans the text, it only chooses one value.
function single(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

// A TYPE GUARD. The `v is ProductSort` return type is the special part: when this
// returns true, TypeScript treats v as ProductSort for the rest of that branch.
// So "?sort=lol" gets rejected here instead of reaching the data layer.
function isSort(v: string | undefined): v is ProductSort {
    return (
        v === "newest" || v === "price-asc" || v === "price-desc" || v === "name"
    );
}

// Turns "?page=abc", "?page=-2" or a missing page into a usable 1.
// Number.isInteger rejects NaN and decimals; >= 1 rejects 0 and negatives.
// This IS real input validation — it guarantees a safe number leaves this function.
function toPage(value: string | undefined): number {
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 ? n : 1;
}

export default async function ShopCategoryPage({ params, searchParams }: PageProps) {
    // 1. Read the [category] folder value out of the URL path. /shop/electronics → "electronics"
    const { category } = await params;

    // 2. Confirm that category actually exists, so /shop/nonsense 404s instead of showing an empty list.
    const found = await getCategory(category);
    if (!found) {
        notFound();
    }

    // 3. Read the ?key=value part of the URL. Separate from params, and also a Promise.
    const query = await searchParams;

    // 4. query.sort is whatever came after "?sort=". Could be a string, an array, or missing.
    //    single() picks one value, isSort() checks it's one we allow, else fall back to "newest".
    const rawSort = single(query.sort);
    const sort: ProductSort = isSort(rawSort) ? rawSort : "newest";

    // 5. Same for "?page=". toPage() guarantees a whole number >= 1, whatever junk was typed.
    const page = toPage(single(query.page));

    // 6. Hand all three to the data layer. It does the filtering, sorting and slicing.
    const { items, total, totalPages } = await getProducts({
        category,
        sort,
        page,
        pageSize: 6,
    });

    // 7. Build the Previous/Next hrefs.
    //    URLSearchParams writes the "?" and "&" and escapes special characters for us.
    //    We re-add sort so clicking Next keeps the current sort instead of resetting it.
    function linkTo(nextPage: number) {
        const p = new URLSearchParams();
        if (rawSort) p.set("sort", rawSort);
        p.set("page", String(nextPage));
        return `/shop/${category}?${p.toString()}`;
    }

    // 8. Render.
    return (
        <main>
            <h1>{found.name}</h1>
            <p>{found.description}</p>
            <p>
                {total} products · sorted by {sort} · page {page} of {totalPages}
            </p>

            {items.length === 0 ? (
                <p>No products on this page.</p>
            ) : (
                <ul>
                    {items.map((product) => (
                        <li key={product.id}>
                            <Link href={`/products/${product.id}`}>{product.name}</Link>
                            {/* price is stored in cents, so /100 to display */}
                            {" — "}${(product.price / 100).toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}

            <p>
                {/* Hide Previous on the first page, Next on the last */}
                {page > 1 && <Link href={linkTo(page - 1)}>← Previous</Link>}{" "}
                {page < totalPages && <Link href={linkTo(page + 1)}>Next →</Link>}
            </p>
        </main>
    );
}
