import { getSalesRecords } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sales Report",
};


export default async function ReportsPage() {
    const records = await getSalesRecords();

    // All of this arithmetic happens on the server. The browser never sees
    // the loop, the records, or this code.

    const totalRevenue = records.reduce(
        (sum, r) => sum + r.quantity * r.unitPrice,
        0
    );

    const totalUnits = records.reduce((sum, r) => sum + r.quantity, 0);

    // Revenue per region
    const byRegion = new Map<string, number>();
    for (const r of records) {
        const current = byRegion.get(r.region) ?? 0;
        byRegion.set(r.region, current + r.quantity * r.unitPrice);
    }

    // Best-selling products by units
    const byProduct = new Map<string, number>();
    for (const r of records) {
        byProduct.set(r.productId, (byProduct.get(r.productId) ?? 0) + r.quantity);
    }

    const topProducts = [...byProduct.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // ── 3. Render ONLY the summary ─────────────────────────────────────────
    return (
        <div className="container">
            <h1>Sales Report</h1>

            <p>
                Computed from <strong>{records.length.toLocaleString()}</strong>{" "}
                sales records — none of which were sent to your browser.
            </p>

            <section>
                <h2>Totals</h2>
                <ul>
                    <li>Revenue: ${(totalRevenue / 100).toLocaleString()}</li>
                    <li>Units sold: {totalUnits.toLocaleString()}</li>
                    <li>
                        Average order value: $
                        {(totalRevenue / records.length / 100).toFixed(2)}
                    </li>
                </ul>
            </section>

            <section>
                <h2>Revenue by region</h2>
                <ul>
                    {[...byRegion.entries()].map(([region, revenue]) => (
                        <li key={region}>
                            {region}: ${(revenue / 100).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Top 5 products by units</h2>
                <ol>
                    {topProducts.map(([productId, units]) => (
                        <li key={productId}>
                            {productId} — {units.toLocaleString()} units
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}

