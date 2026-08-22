import { getRecommendations, getProducts } from "@/lib/db";
import Link from "next/link";

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function FailureLabPage({ searchParams }: PageProps) {
    const query = await searchParams;
    const fail = query.fail === "1";

    const { total } = await getProducts({ pageSize: 1 });

    // No try/catch. If this throws, nothing below renders.
    const recommendations = await getRecommendations({ fail });

    return (
        <div>
            <h2>Failure lab — Version A (throw)</h2>

            <p>{total} products in the catalogue.</p>

            <h3>Recommended</h3>
            <ul>
                {recommendations.map((r) => (
                    <li key={r.id}>{r.name}</li>
                ))}
            </ul>

            <p>
                <Link href="/lab/failure?fail=1">Break it →</Link> ·{" "}
                <Link href="/lab/failure">Fix it</Link>
            </p>

            <hr />

            <p>
                <small>
                    Compare with{" "}
                    <Link href="/products?failrecs=1">
                        /products?failrecs=1
                    </Link>{" "}
                    — same failing call, but caught locally, so only the
                    Recommended strip degrades and the catalogue still works.
                </small>
            </p>
        </div>
    );
}
