/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 4, PROBLEM 7 — Dashboard filter

   The server got the orders. This bit lets you narrow them down.

   WHAT MAKES THIS PROBLEM DIFFERENT FROM THE OTHERS

   It isn't about the filtering — you've done that before in ProductFilter.
   It's about WHERE you put "use client", and being able to MEASURE the cost
   of putting it in the wrong place.

   Right now "use client" is here, on this small component. The dashboard page
   above stays on the server.

   Later you'll move it up to page.tsx and measure how much more JavaScript
   the browser has to download. See the steps at the bottom of this file.
   ═══════════════════════════════════════════════════════════════════════════ */

"use client";

import { useMemo, useState } from "react";
import type { RecentOrder } from "@/lib/db";

type FiltersProps = {
    orders: RecentOrder[];
};

export default function Filters({ orders }: FiltersProps) {
    const [category, setCategory] = useState("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // ── Build the category dropdown options ─────────────────────────────────
    // A Set throws away duplicates automatically. Twenty orders across four
    // categories gives four options, not twenty.
    //
    // [...new Set(...)] turns the Set back into a normal array so we can .map
    // over it in JSX.
    const categories = useMemo(
        () => [...new Set(orders.map((order) => order.category))].sort(),
        [orders]
    );

    // ── The filtering ───────────────────────────────────────────────────────
    //
    // WHY useMemo?
    //
    // Every time ANY state changes, React re-runs this whole function. Without
    // useMemo, this filter would run again even when something unrelated
    // changed.
    //
    // useMemo says: "only redo this if one of the things in the list below
    // actually changed. Otherwise give me last time's answer."
    //
    // With 20 orders you will not notice the difference. With 20,000 you would.
    // The habit is what matters — and interviewers ask about it.
    const visible = useMemo(() => {
        return orders.filter((order) => {
            // Category: "all" means don't filter on it at all.
            if (category !== "all" && order.category !== category) {
                return false;
            }

            // Dates. The <input type="date"> gives us "2026-08-14".
            // order.placedAt is a full ISO string, "2026-08-14T12:00:00.000Z".
            //
            // .slice(0, 10) chops off the time part so we're comparing
            // like with like: "2026-08-14" vs "2026-08-14".
            //
            // And because ISO dates are written biggest-unit-first
            // (year-month-day), comparing them as plain strings gives the
            // right answer. "2026-08-14" < "2026-09-01" is true, just like
            // the real dates. No date library needed.
            const day = order.placedAt.slice(0, 10);

            if (from && day < from) return false;
            if (to && day > to) return false;

            return true;
        });
    }, [orders, category, from, to]);

    const totalValue = visible.reduce((sum, order) => sum + order.total, 0);

    return (
        <section>
            <h2>Orders</h2>

            <div className="filter-bar">
                <div className="field">
                    <label htmlFor="filter-category">Category</label>
                    <select
                        id="filter-category"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="all">All categories</option>
                        {categories.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="filter-from">From</label>
                    <input
                        id="filter-from"
                        type="date"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                    />
                </div>

                <div className="field">
                    <label htmlFor="filter-to">To</label>
                    <input
                        id="filter-to"
                        type="date"
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                    />
                </div>

                {/* Only offer "clear" when there's something to clear. */}
                {(category !== "all" || from || to) && (
                    <button
                        type="button"
                        onClick={() => {
                            setCategory("all");
                            setFrom("");
                            setTo("");
                        }}
                    >
                        Clear filters
                    </button>
                )}
            </div>

            <p>
                <small>
                    Showing {visible.length} of {orders.length} orders — $
                    {(totalValue / 100).toFixed(2)} total
                </small>
            </p>

            {visible.length === 0 ? (
                <p>No orders match those filters.</p>
            ) : (
                <ul>
                    {visible.map((order) => (
                        <li key={order.id}>
                            {order.placedAt.slice(0, 10)} — {order.productName} —{" "}
                            {order.customer} — ${(order.total / 100).toFixed(2)}{" "}
                            <em>({order.category})</em>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ★ THE MEASUREMENT — this is the actual exercise

   ⚠️ Note if you read this anywhere else: Next.js 15 and earlier printed a
   "First Load JS" column in the `npm run build` output. NEXT 16 REMOVED IT.
   The Next team dropped it because the number was inaccurate for apps built
   this way. So we measure in the browser instead, which is more real anyway.

   STEP 1 — get the "before" number
       npm run build
       npm start
       Open http://localhost:3000/dashboard
       DevTools → Network tab → click the "JS" filter → hard-reload (Ctrl+F5)
       Read "transferred" at the bottom of the panel.   ______ kB

   STEP 2 — break it on purpose
       Open app/dashboard/page.tsx and add "use client" as its first line.
       It will complain, because a Client Component can't be async or await —
       so also comment out the data fetching and hand Filters an empty array
       for now. You only need it to build.

   STEP 3 — get the "after" number
       npm run build && npm start
       Same page, same Network panel, same hard reload.   ______ kB

   STEP 4 — put page.tsx back exactly as it was.

   (There's also `npx next experimental-analyze`, which opens a browser view
   breaking down exactly what's in your bundles. Worth a look once, but the
   Network tab is enough for this exercise.)

   ───────────────────────────────────────────────────────────────────────────
   WHY THE NUMBER GOES UP

   "use client" doesn't only affect the file you put it in. It marks a
   BOUNDARY: that component and everything it renders below it all become
   client code and get shipped to the browser.

     "use client" here (small leaf)      →  only this file ships
     "use client" on page.tsx (the top)  →  the whole dashboard ships

   Same screen, same features, more download.

   That's what "push the boundary down" means: put "use client" on the
   smallest thing that actually needs to react to a click, never on the page.

   Being able to say "I measured it, it went from X to Y" is a much better
   interview answer than "it's better for bundle size".

   ───────────────────────────────────────────────────────────────────────────
   WHILE YOU'RE HERE

   Open the Network tab and change a filter. Nothing happens — no requests.
   The server already sent all 20 orders; this is pure browser work.

   Compare with the SearchBox in Problem 2, which puts the value in the URL and
   would let the SERVER do the filtering. Two valid approaches:

     this way   instant, private, gone on refresh
     SearchBox  shareable, survives refresh, server can read it
   ═══════════════════════════════════════════════════════════════════════════ */
