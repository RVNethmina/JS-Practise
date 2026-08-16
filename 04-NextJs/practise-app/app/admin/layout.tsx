import { redirect } from "next/navigation";
import type { Role } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────
// Why `Role` and not `string`
//
// You had:   const role: string = "user";
//
// That works, but two problems:
//
//   1. "user" isn't one of our actual roles. They're "admin" | "editor" |
//      "viewer" (see lib/types.ts). With `string`, that typo compiles.
//
//   2. Annotating as `string` throws away the checking. Change it to
//      "admni" and TypeScript still says nothing.
//
// With `Role`, only the three real values are allowed. Try typing
// "user" below and you'll get a compile error — which is the point.
//
// (Why annotate at all? Without it, `const role = "viewer"` infers the
// literal type "viewer", and TypeScript then flags `role !== "admin"` as
// a comparison that can never be false. The annotation widens it to the
// full union so the comparison is meaningful.)
// ─────────────────────────────────────────────────────────────────────────

const role: Role = "viewer"; // ← flip to "admin" to get in

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (role !== "admin") {
        redirect("/login");
    }

    return (
        <div className="container">
            <h1>Admin</h1>
            <main>{children}</main>
        </div>
    );
}

// ⚠️ THIS IS NOT SECURITY.
//
// A layout does not re-run on every navigation between its children, so
// this check can go stale mid-session. It's a UX convenience that redirects
// people early — nothing more.
//
// The real check goes in the page itself, and in every Server Action and
// Route Handler that touches admin data. Phase 12 replaces this hardcoded
// constant with a real verified session and puts the checks where they
// actually belong.
