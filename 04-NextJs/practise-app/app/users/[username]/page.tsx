import { getUser, getPostsByAuthor, getCategories } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const TABS = ["posts", "about"] as const;

export default async function UserProfilePage({ params, searchParams }: PageProps) {
    const { username } = await params;
    const query = await searchParams;

    const started = Date.now();


    // 1. Start the independent fetch. NO await — this only kicks it off.
    //    Calling a function starts the work; await only waits for it.
    const categoriesPromise = getCategories();

    // 2. Now the dependent chain. getCategories is already running in the
    //    background while these two happen.
    const user = await getUser(username);
    if (!user) {
        notFound();
    }

    // 3. This is the real dependency — it needs user.id, which only exists now.
    const posts = await getPostsByAuthor(user.id);

    // 4. Collect the one we started first. By now it finished long ago,
    //    so this await costs nothing.
    const categories = await categoriesPromise;

    const elapsed = Date.now() - started;

    const raw = Array.isArray(query.tab) ? query.tab[0] : query.tab;
    const tab = TABS.find((t) => t === raw) ?? "posts";

    return (
        <main>
            <h1>{user.name}</h1>
            <p>
                @{user.username} · {user.role}
            </p>

            {/* Watch this number. ~600ms as written; ~900ms if you move
                `await categoriesPromise` up and await getCategories inline. */}
            <p>
                <small>Loaded in {elapsed}ms</small>
            </p>

            <nav>
                {TABS.map((t) => (
                    <span key={t}>
                        <Link href={`/users/${username}?tab=${t}`}>
                            {t === tab ? <strong>{t}</strong> : t}
                        </Link>{" "}
                    </span>
                ))}
            </nav>

            {tab === "about" ? (
                <section>
                    <h2>About</h2>
                    <ul>
                        <li>Email: {user.email}</li>
                        <li>Joined: {user.createdAt.slice(0, 10)}</li>
                    </ul>
                </section>
            ) : (
                <section>
                    <h2>Posts by {user.name}</h2>
                    {posts.length === 0 ? (
                        <p>{user.name} hasn&apos;t written anything yet.</p>
                    ) : (
                        <ul>
                            {posts.map((post) => (
                                <li key={post.id}>
                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>{" "}
                                    <small>{post.publishedAt.slice(0, 10)}</small>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}

            {/* The independent fetch — unrelated to this user, which is exactly
                why it had no business waiting for them. */}
            <section>
                <h2>Browse</h2>
                <p>
                    {categories.map((c) => (
                        <span key={c.id}>
                            <Link href={`/shop/${c.slug}`}>{c.name}</Link>{" "}
                        </span>
                    ))}
                </p>
            </section>

            <p>
                <Link href="/users">← All users</Link>
            </p>
        </main>
    );
}
