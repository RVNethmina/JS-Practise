"use client";
// ↑ MUST be the very first line, before all imports.
//
// Why this file needs it: usePathname() is a React hook. Hooks only work in
// Client Components. Without this directive you get:
//   "usePathname only works in Client Components"

import Link from "next/link";
import { usePathname } from "next/navigation";
// ⚠️ next/navigation — NOT next/router. next/router is the old Pages Router
// and will not work here. This is the single most common import mistake.

type NavLink = {
    href: string;
    label: string;
};

type NavProps = {
    links: NavLink[];
};

export default function Nav({ links }: NavProps) {
    // Gives you the current path as a string, e.g. "/about".
    // Note: it does NOT include the ?query=string part.
    const pathname = usePathname();

    return (
        <nav className="bar">
            {links.map((link) => {
                // Exact match for "/" (otherwise every path would match it),
                // prefix match for everything else so /docs/a/b still
                // highlights the "Docs" link.
                const isActive =
                    link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={isActive ? "active" : undefined}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// IMPORTANT: this being a Client Component does NOT make its parent one.
//
// A Server Component layout can import and render <Nav />. Only THIS file
// and anything it imports ends up in the browser bundle. The layout around
// it still runs on the server.
//
// That's the "push the boundary down" idea from the vault — the interactive
// leaf is client, everything above it stays server.
// ─────────────────────────────────────────────────────────────────────────
