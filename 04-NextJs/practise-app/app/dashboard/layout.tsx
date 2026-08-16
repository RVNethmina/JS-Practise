import { getCategories } from "@/lib/db";
import Sidebar from "./_components/Sidebar";
import DashboardNav from "./DashboardNav";

// This layout is an ASYNC SERVER COMPONENT.
//
// It can await data directly — no useEffect, no loading state. That's only
// possible because it's a Server Component (no "use client" at the top).
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetched on the server, passed down to the client Sidebar as a prop.
    //
    // Bonus: because layouts persist across navigation, this fetch runs
    // ONCE — not again every time you click between dashboard pages.
    const categories = await getCategories();

    return (
        <div className="dash-shell">
            <Sidebar categories={categories} />

            <div className="dash-main">
                <DashboardNav />
                <main>{children}</main>
            </div>
        </div>
    );
}
