import { getStats, getRecentOrders, getNotifications } from "@/lib/db";
import FilterDashboardComponent from "./_components/Filters";

export default async function DashboardPage() {

    const [stats, orders, notifications] = await Promise.all([
        getStats(),
        getRecentOrders(),
        getNotifications(),
    ]);


    return (
        <div>
            <FilterDashboardComponent />
            
            <h1>Dashboard</h1>
            {/* ── Section 1: stats ─────────────────────────────────────── */}
            <section>
                <h2>Overview</h2>
                <ul>
                    <li>Products: {stats.totalProducts}</li>
                    <li>Users: {stats.totalUsers}</li>
                    <li>Posts: {stats.totalPosts}</li>
                    <li>Out of stock: {stats.outOfStock}</li>
                </ul>
            </section>

            {/* ── Section 2: recent orders ─────────────────────────────── */}
            <section>
                <h2>Recent orders</h2>
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            {order.productName} — {order.customer} — $
                            {(order.total / 100).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </section>

            {/* ── Section 3: notifications ─────────────────────────────── */}
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