import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/db";

export const metadata: Metadata = {
    title: "Blog",
    description: "Notes on building the storefront.",
};

export default async function BlogIndexPage() {
    const posts = await getPosts();

    const sorted = [...posts].sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt)
    );

    return (
        <main>
            <h1>Blog</h1>
            <p>{posts.length} posts</p>

            {posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                <ul>
                    {sorted.map((post) => (
                        <li key={post.id}>
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            <br />
                            <small>{post.publishedAt.slice(0, 10)}</small>
                            <p>{post.excerpt}</p>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}