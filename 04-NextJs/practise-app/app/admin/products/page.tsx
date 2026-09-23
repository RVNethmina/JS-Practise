import { getProducts } from "@/lib/products";
import Link from "next/link";
import DeleteButton from "./_components/DeleteButton";

export default async function ProductsPage() {

    const { items } = await getProducts({ pageSize: 50 });

    return (
        <div>
            <h1>Products</h1>
            <Link href="/admin/products/new">New product</Link>

            {items.map((product) => (
                <div key={product.id}>
                    <p>{product.name} — ${(product.price / 100).toFixed(2)}</p>
                    <DeleteButton id={product.id} />
                </div>
            ))}
        </div>
    );
}
