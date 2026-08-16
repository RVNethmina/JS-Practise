import Link from "next/link";
import type { Metadata } from "next";

// Problem 1 asked for a metadata export — this sets the browser tab title.
export const metadata: Metadata = {
    title: "Home",
    description: "A storefront built for practice.",
};

export default function MarketingPage() {
    return (
        <div>
            <h1>Welcome</h1>
            <p>Home page</p>

            {/* A Link needs text between the tags, or there's nothing to click */}
            <nav>
                <Link href="/products/p-3">A product</Link>
                {" · "}
                <Link href="/about">About</Link>
                {" · "}
                <Link href="/pricing">Pricing</Link>
                {" · "}
                <Link href="/docs">Docs</Link>
                {" · "}
                <Link href="/dashboard">Dashboard</Link>
            </nav>
        </div>
    );
}
