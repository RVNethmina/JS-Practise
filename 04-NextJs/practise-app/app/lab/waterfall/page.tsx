import { getPosts, getUsers, getStats } from "@/lib/db";


// ── A. One after another ────────────────────────────────────────────────────
async function runSequential() {
    const start = Date.now();

    // Each `await` blocks the next line. getUsers doesn't even START until
    // getPosts has completely finished.
    const posts = await getPosts();
    const users = await getUsers();
    const stats = await getStats();

    return { ms: Date.now() - start, counts: [posts.length, users.length, stats.totalProducts] };
}

// ── B. All at once ──────────────────────────────────────────────────────────
async function runParallel() {
    const start = Date.now();

    // The three calls happen FIRST — three requests already in flight —
    // and only then do we wait. Note the (), see the warning below.
    const [posts, users, stats] = await Promise.all([
        getPosts(),
        getUsers(),
        getStats(),
    ]);

    return { ms: Date.now() - start, counts: [posts.length, users.length, stats.totalProducts] };
}

// ── C. The bug that looks like a win ────────────────────────────────────────
async function runBroken() {
    const start = Date.now();

    // Your version had this: the function NAMES, with no ().
    // These aren't promises — they're functions. Promise.all resolves
    // non-promise values instantly, so this finishes in ~0ms having
    // fetched absolutely nothing.
    const results = await Promise.all([getPosts, getUsers, getStats]);

    return { ms: Date.now() - start, types: results.map((r) => typeof r) };
}

export default async function WaterfallPage() {
    const sequential = await runSequential();
    const parallel = await runParallel();
    const broken = await runBroken();

    return (
        <div>
            <h2>Waterfall vs parallel</h2>

            <table>
                <thead>
                    <tr>
                        <th align="left">Approach</th>
                        <th align="left">Time</th>
                        <th align="left">What came back</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>A — sequential awaits</td>
                        <td>
                            <strong>{sequential.ms}ms</strong>
                        </td>
                        <td>{sequential.counts.join(", ")}</td>
                    </tr>
                    <tr>
                        <td>B — Promise.all</td>
                        <td>
                            <strong>{parallel.ms}ms</strong>
                        </td>
                        <td>{parallel.counts.join(", ")}</td>
                    </tr>
                    <tr>
                        <td>C — Promise.all, missing ()</td>
                        <td>
                            <strong>{broken.ms}ms</strong>
                        </td>
                        <td>{broken.types.join(", ")} ⚠️</td>
                    </tr>
                </tbody>
            </table>

            <p>
                Row C is the trap: it looks like the fastest result on the page,
                but the third column shows what it actually returned —{" "}
                <code>function, function, function</code>. Nothing was fetched.
            </p>

            <p>
                <small>
                    A ≈ 300 + 300 + 800. B ≈ the slowest single fetch. The
                    difference is why &quot;calling starts the work, await only
                    waits&quot; is worth memorising.
                </small>
            </p>
        </div>
    );
}
