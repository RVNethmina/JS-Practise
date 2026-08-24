import { getStats, getRecentOrders, getNotifications } from "@/lib/db";
import Filters from "./_components/Filters";

export default async function DashboardPage() {
    // Phase 3, Problem 3: all three start at once, so this takes as long as
    // the slowest one (1200ms) instead of the sum (2600ms).
    const [stats, orders, notifications] = await Promise.all([
        getStats(),
        getRecentOrders(),
        getNotifications(),
    ]);

    return (
        <div>
            <h1>Dashboard</h1>

            {/* ── Stats ────────────────────────────────────────────────── */}
            <section>
                <h2>Overview</h2>
                <ul>
                    <li>Products: {stats.totalProducts}</li>
                    <li>Users: {stats.totalUsers}</li>
                    <li>Posts: {stats.totalPosts}</li>
                    <li>Out of stock: {stats.outOfStock}</li>
                </ul>
            </section>

            <Filters orders={orders} />

            {/* ── Notifications ────────────────────────────────────────── */}
            <section>
                <h2>Notifications</h2>
                {notifications.length === 0 ? (
                    <p>Nothing to report.</p>
                ) : (
                    <ul>
                        {notifications.map((n) => (
                            <li key={n.id}>
                                {n.read ? "○" : "●"} {n.message}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
