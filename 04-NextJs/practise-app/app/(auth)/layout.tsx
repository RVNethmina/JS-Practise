import Link from "next/link";

// A deliberately BARE shell — no site nav, no marketing header, no footer.
//
// Compare /login with / and you should see two completely different pages.
// That contrast is the whole point of Problem 3.
//
// This works because (auth) is a route group: /login and /register live
// inside it, so they get this shell instead of the marketing one — while
// the URLs stay clean (/login, not /auth/login).
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth-screen">
            <main className="auth-card">
                {children}

                <hr />
                <small>
                    <Link href="/">← Back to the site</Link>
                </small>
            </main>
        </div>
    );
}
