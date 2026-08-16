import Link from "next/link";
import type { Metadata } from "next";

// Optional catch-all: [[...slug]] matches /docs (no segments) as well as
// /docs/a/b/c — so `slug` can be undefined. That's why it's `slug?`.
// A plain [...slug] would never match bare /docs and could use `slug: string[]`.
type PageProps = {
    params: Promise<{ slug?: string[] }>;
};

export const metadata: Metadata = {
    title: "Documentation",
};

export default async function DocsPage({ params }: PageProps) {
    const { slug } = await params;

    // Bare /docs — no segments at all
    if (!slug || slug.length === 0) {
        return (
            <div>
                <h1>Documentation</h1>
                <p>Pick a page to get started.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Breadcrumbs: each crumb links to the path up to and including itself */}
            <nav>
                <Link href="/docs">docs</Link>
                {slug.map((segment, index) => {
                    const href = `/docs/${slug.slice(0, index + 1).join("/")}`;
                    return (
                        <span key={href}>
                            {" / "}
                            <Link href={href}>{segment}</Link>
                        </span>
                    );
                })}
            </nav>

            <h1>{slug[slug.length - 1]}</h1>
            <p>Depth: {slug.length}</p>
        </div>
    );
}
