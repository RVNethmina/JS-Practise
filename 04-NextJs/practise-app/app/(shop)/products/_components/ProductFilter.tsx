"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";

type ProductFilterProps = {
    products: Product[];
};

export default function ProductFilter({ products }: ProductFilterProps) {
    // ── The whole reason this is a Client Component ──────────────────────
    const [query, setQuery] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);

    // Filtering happens in the BROWSER, on data the server already sent.
    // No network request when you type.
    const visible = products.filter((product) => {
        const matchesQuery = product.name
            .toLowerCase()
            .includes(query.toLowerCase());

        const matchesStock = inStockOnly ? product.inStock : true;

        return matchesQuery && matchesStock;
    });

    return (
        <div>
            <div>
                <input
                    type="search"
                    placeholder="Filter products…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <label>
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    In stock only
                </label>
            </div>

            <p>
                <small>
                    Showing {visible.length} of {products.length}
                </small>
            </p>
            <ul>
                {visible.map((product) => (
                    <li key={product.id}>
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                        {" — "}
                        <span>${(product.price / 100).toFixed(2)}</span>
                        {!product.inStock && <em> (out of stock)</em>}
                    </li>
                ))}
            </ul>

            {visible.length === 0 && <p>No products match that filter.</p>}
        </div>
    );
}
