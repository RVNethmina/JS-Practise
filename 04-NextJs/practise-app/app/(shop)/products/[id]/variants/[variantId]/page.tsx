import { getProduct, getProducts } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

// TWO dynamic segments, one nested inside the other:
//   app/(shop)/products/[id]/variants/[variantId]/page.tsx
//   /products/p-3/variants/v-1  →  { id: "p-3", variantId: "v-1" }
type PageProps = {
    params: Promise<{ id: string; variantId: string }>;
};

// 1. For nested dynamic routes, generateStaticParams must return every valid
//    COMBINATION — one object holding both params, not one per level.
export async function generateStaticParams() {
    // pageSize: 50 because the default is 8. Without it you'd silently
    // pre-build variants for only the first 8 products and never notice.
    const { items } = await getProducts({ pageSize: 50 });

    // 2. flatMap, not map. map would give an array-of-arrays
    //    ([[{...},{...}], [{...}]]); flatMap flattens it one level into the
    //    single flat list Next expects.
    return items.flatMap((product) =>
        product.variants.map((variant) => ({
            id: product.id,          // key must match [id]
            variantId: variant.id,   // key must match [variantId]
        }))
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id, variantId } = await params;
    const product = await getProduct(id);
    const variant = product?.variants.find((v) => v.id === variantId);

    if (!product || !variant) return { title: "Variant not found" };

    return { title: `${product.name} — ${variant.name}` };
}

export default async function ProductVariantPage({ params }: PageProps) {
    // 3. Both segments arrive in the same params object.
    const { id, variantId } = await params;

    // 4. Fetch the parent product first.
    const product = await getProduct(id);
    if (!product) notFound();

    // 5. This is the .find() you correctly guessed you needed.
    //    Variants live INSIDE the product, so there's no second db call —
    //    we already have them.
    const variant = product.variants.find((v) => v.id === variantId);

    // 6. Both must exist. A real product with a made-up variant is still a 404 —
    //    your version only checked the product.
    if (!variant) notFound();

    // 7. priceDelta is the difference from the base price, not the full price.
    //    Both are in cents, so add first and divide by 100 only to display.
    const price = product.price + variant.priceDelta;

    return (
        <article>
            <h1>{product.name}</h1>
            <h2>{variant.name}</h2>

            <ul>
                <li>SKU: {variant.sku}</li>
                <li>Price: ${(price / 100).toFixed(2)}</li>
                <li>{variant.inStock ? "In stock" : "Out of stock"}</li>
            </ul>

            {/* 8. Sibling variants, so you can move between them. */}
            <p>Other options:</p>
            <ul>
                {product.variants.map((v) => (
                    <li key={v.id}>
                        {v.id === variantId ? (
                            <strong>{v.name}</strong>
                        ) : (
                            <Link href={`/products/${id}/variants/${v.id}`}>
                                {v.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

            <p>
                <Link href={`/products/${id}`}>← Back to {product.name}</Link>
            </p>
        </article>
    );
}
