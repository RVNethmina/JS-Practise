import { getCategories } from "@/lib/db";
import Sidebar from "./_components/Sidebar";
import DashboardNav from "./DashboardNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
