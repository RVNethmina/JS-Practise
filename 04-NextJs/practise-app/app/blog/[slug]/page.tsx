import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPost, getPosts } from "@/lib/db";

type PageProps = {
    params: Promise<{ slug: string }>;
};


export async function generateStaticParams() {
    
    const posts = await getPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return { title: "Post not found" };
    }

    return {
        title: post.title,
        description: post.excerpt,
    };
}

/* ── EXPORT 3 — the page itself ───────────────────────────────────────────── */
/* PHASE 6, PROBLEM 4 — where revalidate would go.

   This page reads the database directly, so there is no fetch to attach
   caching options to. Once it does use fetch, the option lands here:

     const res = await fetch(url, { next: { revalidate: 3600 } });

   Meaning: serve the cached copy, and after an hour refresh it in the
   background. Right now the HTML is frozen at build time until you rebuild.

   The db-direct equivalent is unstable_cache — Phase 11, Problem 3. */
export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;

    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <article>
            <h1>{post.title}</h1>

            {/* publishedAt is an ISO STRING, not a Date object.
                slice(0, 10) turns "2026-01-10T09:00:00.000Z" into "2026-01-10". */}
            <p>
                <small>Published {post.publishedAt.slice(0, 10)}</small>
            </p>

            <p>
                <em>{post.excerpt}</em>
            </p>

            <p>{post.body}</p>

            <p>Tags: {post.tags.join(", ")}</p>

            <p>
                <Link href="/blog">← All posts</Link>
            </p>
        </article>
    );
}

