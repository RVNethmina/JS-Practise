import { getStats, getRecentOrders, getNotifications } from "@/lib/db";

/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 3, PROBLEM 3 — fetch three things in PARALLEL

   Three pieces of data. None depends on the others.

     getStats()           takes  800ms
     getRecentOrders()    takes 1200ms
     getNotifications()   takes  600ms

   ───────────────────────────────────────────────────────────────────────────
   ❌ THE SLOW WAY — 2600ms

     const stats  = await getStats();           // 800ms
     const orders = await getRecentOrders();    // 1200ms
     const notifs = await getNotifications();   // 600ms

     0ms ────────── 800 ──────────────── 2000 ──────── 2600
         │ getStats  │
                     │ getRecentOrders   │
                                         │ getNotifs │
                                                     ▲ page renders

     getRecentOrders() doesn't even START until getStats() has finished.
     Total = the SUM. This shape is called a "request waterfall".

   ───────────────────────────────────────────────────────────────────────────
   ✅ THE FAST WAY — 1200ms

     const [stats, orders, notifs] = await Promise.all([...]);

     0ms ──────────────────────── 1200
         │ getStats  │
         │ getRecentOrders       │
         │ getNotifs │
                                 ▲ page renders

     All three start immediately. Total = the SLOWEST one, not the sum.

   ───────────────────────────────────────────────────────────────────────────
   WHY IT WORKS — the one insight that matters

     Calling a function STARTS the work.
     `await` only WAITS for it.

     Those are two separate moments. In the slow version the `await` is glued
     onto the call, so the next request can't begin until the previous one has
     completely finished.

     In Promise.all, all three calls happen first — three requests are already
     in flight — and only then do we wait.
   ═══════════════════════════════════════════════════════════════════════════ */

export default async function DashboardPage() {

    const [stats, orders, notifications] = await Promise.all([
        getStats(),
        getRecentOrders(),
        getNotifications(),
    ]);


    return (
        <div>
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