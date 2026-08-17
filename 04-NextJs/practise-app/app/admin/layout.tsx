import { redirect } from "next/navigation";
import type { Role } from "@/lib/types";


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

