"use client";

import { deleteProductAction } from "@/app/actions/products";
import type { Product } from "@/lib/types";
import { useOptimistic, useState } from "react";
import DeleteButton from "./DeleteButton";

export default function ProductList({ items }: { items: Product[] }) {
    const [error, setError] = useState("");

    const [optimisticItems, removeOptimistic] = useOptimistic(
        items,
        (current, removedId: string) => current.filter((p) => p.id !== removedId)
    );

    async function handleDelete(id: string) {
        setError("");
        removeOptimistic(id);

        const result = await deleteProductAction(id);

        if (result.error) {
            setError(result.error);
        }
    }

    return (
        <div>
            {error && <p>{error}</p>}

            {optimisticItems.map((product) => (
                <div key={product.id}>
                    <p>{product.name} — ${(product.price / 100).toFixed(2)}</p>
                    <DeleteButton action={handleDelete.bind(null, product.id)} />
                </div>
            ))}
        </div>
    );
}
