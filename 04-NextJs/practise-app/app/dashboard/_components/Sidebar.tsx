"use client";

import { useState } from "react";
import Link from "next/link";

// Data comes in as a PROP from the server. This component never reads the
// database itself — a Client Component can't (no fs, no async).
//
// The layout fetches categories on the server and passes them down.
// Plain objects like these cross the server→client boundary fine.
type SidebarProps = {
    categories: { id: string; slug: string; name: string }[];
};

export default function Sidebar({ categories }: SidebarProps) {
    // ⭐ THIS is the state the whole exercise is about.
    const [collapsed, setCollapsed] = useState(false);

    // Also a counter, purely so you can SEE the persistence.
    const [clicks, setClicks] = useState(0);

    return (
        <aside
            className="dash-sidebar"
            style={{ width: collapsed ? 60 : 220 }}
        >
            <button onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? "»" : "« Collapse"}
            </button>

            {!collapsed && (
                <>
                    <nav>
                        <Link href="/dashboard">Overview</Link>
                        <Link href="/dashboard/settings">Settings</Link>
                        <Link href="/dashboard/settings/profile">Profile</Link>
                    </nav>

                    <hr />

                    <p style={{ fontSize: "0.8rem" }}>Categories</p>
                    {categories.map((c) => (
                        <Link key={c.id} href={`/shop/${c.slug}`}>
                            {c.name}
                        </Link>
                    ))}

                    <hr />

                    {/* ── THE EXPERIMENT ─────────────────────────────────
                        1. Click this button a few times
                        2. Click Settings, then Profile, then Overview
                        3. The number DOES NOT RESET

                        Why: this component lives in the LAYOUT. When you
                        navigate between dashboard pages, Next.js keeps the
                        layout's React instance alive and swaps only the
                        page underneath. So useState survives.

                        Now move this same button into dashboard/page.tsx
                        and repeat — it resets to 0 every time, because the
                        PAGE is destroyed and rebuilt on each navigation.
                    ─────────────────────────────────────────────────────── */}
                    <button onClick={() => setClicks(clicks + 1)}>
                        Clicked {clicks} times
                    </button>
                </>
            )}
        </aside>
    );
}
