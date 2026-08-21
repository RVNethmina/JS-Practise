import { getStats, getRecentOrders, getNotifications } from "@/lib/db";
import Filters from "./_components/Filters";

/* This page stays a SERVER component.

   It fetches everything, then hands the orders down to <Filters />, which is
   the only interactive part and the only thing that ships to the browser.

   That split is the whole point of Problem 7 — see the measurement steps at
   the bottom of Filters.tsx. */

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

            {/* ── Orders + filters ─────────────────────────────────────────
                The server fetched `orders`. Filters just receives them as a
                prop and narrows them in the browser.

                Plain data crosses the boundary fine: strings and numbers.
                Note RecentOrder.placedAt is a STRING, not a Date — a Date
                object cannot be passed from server to client. */}
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
