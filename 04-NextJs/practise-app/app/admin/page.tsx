import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin",
};

export default function AdminPage() {
    return (
        <div>
            <h2>Admin dashboard</h2>
            <p>
                If you can read this, the role constant in{" "}
                <code>app/admin/layout.tsx</code> is set to &quot;admin&quot;.
            </p>
            <p>
                Flip it back to &quot;viewer&quot; and this page becomes
                unreachable — you get redirected to /login before it renders.
            </p>
        </div>
    );
}
