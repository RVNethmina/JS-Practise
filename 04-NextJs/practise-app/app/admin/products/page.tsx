import { getProducts } from "@/lib/products";
import Link from "next/link";
import ProductList from "./_components/ProductList";

export default async function ProductsPage() {

    const { items } = await getProducts({ pageSize: 50 });

    return (
        <div>
            <h1>Products</h1>
            <Link href="/admin/products/new">New product</Link>

            <ProductList items={items} />
        </div>
    );
}
