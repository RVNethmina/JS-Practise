import Nav from "../_components/Nav";

// Wraps only what's inside app/(shop)/ — currently /products/[id].
//
// Deliberately different from the marketing shell: green header, a cart
// slot, no marketing footer. Visit / and then /products/p-3 and you should
// see two clearly different sites.

const links = [
    { href: "/products", label: "All products" },
    { href: "/", label: "← Back to site" },
];

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <header className="shop-header">
                <Nav links={links} />
            </header>

            <main className="container">{children}</main>
        </>
    );
}
