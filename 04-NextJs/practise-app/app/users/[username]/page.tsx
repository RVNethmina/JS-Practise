import { getUser } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
    params: Promise<{ username: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const TABS = ["posts", "about", "activity"] as const;

export default async function UserProfilePage({ params, searchParams }: PageProps) {
    const { username } = await params;

    const user = await getUser(username);

    if (!user) {
        notFound();
    }

    const query = await searchParams;

    // ?tab=a&tab=b gives an ARRAY, so narrow to a single string first.
    const raw = Array.isArray(query.tab) ? query.tab[0] : query.tab;

    // Only accept tabs we actually have. Anything else falls back.
    const tab = TABS.find((t) => t === raw) ?? "posts";

    return (
        <main>
            <h1>{user.name}</h1>
            <p>@{user.username}</p>

            <ul>
                <li>Email: {user.email}</li>
                <li>Role: {user.role}</li>
                <li>Joined: {user.createdAt.slice(0, 10)}</li>
            </ul>

            <nav>
                {TABS.map((t) => (
                    <span key={t}>
                        <Link href={`/users/${username}?tab=${t}`}>
                            {t === tab ? <strong>{t}</strong> : t}
                        </Link>{" "}
                    </span>
                ))}
            </nav>

            <p>Showing tab: {tab}</p>

            <p>
                <Link href="/users">← All users</Link>
            </p>
        </main>
    );
}
