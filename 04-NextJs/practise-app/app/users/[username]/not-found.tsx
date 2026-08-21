import Link from "next/link";

/* Rendered whenever notFound() is called anywhere in this route segment.
   No imports or wiring needed — the filename IS the API.

   Unlike error.tsx, this is a SERVER component. No "use client". */

export default function UserNotFound() {
    return (
        <div>
            <h1>User not found</h1>
            <p>There&apos;s no account with that username.</p>

            {/* Your version was <Link href="/users" /> — self-closing, so it
                rendered an empty anchor: invisible and unclickable.
                A link needs text between the tags. */}
            <p>
                <Link href="/users">← Back to all users</Link>
            </p>
        </div>
    );
}
