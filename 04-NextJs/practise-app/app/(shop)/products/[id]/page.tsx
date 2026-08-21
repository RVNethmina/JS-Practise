import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/db";
import Link from "next/link";

type PageProps = {
    params: Promise<{ id: string }>;
};
const VALID_ID = /^p-\d+$/; //  p-1, p-42 …  but not "abc" or "../../etc/passwd"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;

    if (!VALID_ID.test(id)) {
        notFound();
    }

    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return {
        title: product.name,
        description: product.description,
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    console.log("[products/[id]] typeof id =", typeof id);

    // 1. Is it even shaped like one of our ids?
    if (!VALID_ID.test(id)) {
        notFound();
    }

    // 2. Does it actually exist?
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <article>
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <ul>
                {/* price is stored in CENTS. Divide by 100 only to display. */}
                <li>Price: ${(product.price / 100).toFixed(2)}</li>
                <li>{product.inStock ? "In stock" : "Out of stock"}</li>
                <li>Tags: {product.tags.join(", ")}</li>
            </ul>

            <p>
                <Link href="/products">← Back to all products</Link>
            </p>
        </article>
    );
}
