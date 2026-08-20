/* A SERVER Component. Note:
     - no "use client"
     - it's async
     - it reads the database directly

   None of that is possible in a Client Component. Yet its output ends up
   INSIDE one. See page.tsx for how. */

import { getProduct } from "@/lib/db";

export default async function ProductDetails({ id }: { id: string }) {
    console.log("[ProductDetails] running on the SERVER");

    const product = await getProduct(id);

    if (!product) return <p>Product not found.</p>;

    return (
        <div>
            <p>{product.description}</p>
            <ul>
                <li>Price: ${(product.price / 100).toFixed(2)}</li>
                <li>{product.inStock ? "In stock" : "Out of stock"}</li>
                <li>Tags: {product.tags.join(", ")}</li>
            </ul>
            <p>
                <small>
                    This block was rendered on the server. Check your terminal —
                    the log above appears there, never in the browser console.
                </small>
            </p>
        </div>
    );
}
