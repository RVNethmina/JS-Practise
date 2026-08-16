import Nav from "../_components/Nav";

// This layout wraps ONLY the pages inside app/(marketing)/ —
// so: /, /about, /pricing
//
// It does NOT wrap /products or /dashboard, even though those are also at
// the top level. That is the entire point of route groups: two different
// shells at the same URL depth.

const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/products", label: "Shop" },
    { href: "/login", label: "Log in" },
];

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <header className="marketing-header">
                <Nav links={links} />
            </header>

            <main className="container">{children}</main>

            <footer className="container">
                <small>Practice storefront — marketing shell</small>
            </footer>
        </>
    );
}

// Note this layout is a SERVER component (no "use client"), even though it
// renders <Nav />, which IS a client component. That mix is normal and
// correct — only Nav's code ships to the browser.
