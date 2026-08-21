import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDoc, getDocs } from "@/lib/db";


type PageProps = {
    params: Promise<{ slug?: string[] }>;
};

// 1. Tell Next which doc pages to build as HTML files.
//    Each doc already stores its path as an array, so we hand those straight back.
//    The index doc's slug is [], which becomes the bare /docs page — that empty
//    array is what makes /docs itself get pre-built too.
export async function generateStaticParams() {
    const docs = await getDocs();
    return docs.map((doc) => ({ slug: doc.slug }));
}

// 2. Per-page title, instead of one shared title for the whole docs site.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const doc = await getDoc(slug ?? []);

    return { title: doc ? doc.title : "Not found" };
}

export default async function DocsPage({ params }: PageProps) {
    // 3. Read the path segments. Undefined for bare /docs.
    const { slug } = await params;

    // 4. Normalise once: undefined and [] both mean "the index page".
    //    Doing this here means everything below only deals with an array.
    const segments = slug ?? [];

    // 5. Look the doc up. getDoc joins the array to "guides/deployment" and
    //    matches it against each stored slug. [] joins to "" → the index doc.
    const doc = await getDoc(segments);

    // 6. Unknown path → real 404. Your version skipped this, so /docs/nonsense
    //    rendered a page with the last URL segment as its heading.
    if (!doc) {
        notFound();
    }

    return (
        <div>
            {/* 7. Breadcrumbs. slice(0, index + 1) builds the path up to each
                   segment: ["a","b","c"] → /docs/a, /docs/a/b, /docs/a/b/c */}
            <nav>
                <Link href="/docs">docs</Link>
                {segments.map((segment, index) => {
                    const href = `/docs/${segments.slice(0, index + 1).join("/")}`;
                    return (
                        <span key={href}>
                            {" / "}
                            <Link href={href}>{segment}</Link>
                        </span>
                    );
                })}
            </nav>

            {/* 8. Render the DOC, not the URL. Your version showed
                   slug[slug.length - 1], so /docs/guides/deployment displayed
                   "deployment" instead of the real title. */}
            <h1>{doc.title}</h1>
            <p>{doc.body}</p>

            <p>
                <small>Depth: {segments.length}</small>
            </p>
        </div>
    );
}
