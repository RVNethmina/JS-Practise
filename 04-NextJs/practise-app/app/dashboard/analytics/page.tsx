import { getAnalytics, getFlakyAnalytics } from "@/lib/dashboard";
import Link from "next/link";

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardAnalyticsPage({ searchParams }: PageProps) {
    const query = await searchParams;

    const fail = query.fail === "1";
    const flaky = query.flaky === "1";

    const analytics = flaky
        ? await getFlakyAnalytics()
        : await getAnalytics({ fail });

    return (
        <div>
            <h2>Analytics</h2>

            <p>Page views: {analytics.pageViews}</p>
            <p>Conversion rate: {analytics.conversionRate}%</p>
            <p>Top referrer: {analytics.topReferrer}</p>

            <p>
                <Link href="/dashboard/analytics?fail=1">Break it</Link>
                {" · "}
                <Link href="/dashboard/analytics?flaky=1">Flaky</Link>
                {" · "}
                <Link href="/dashboard/analytics">Reset</Link>
            </p>
        </div>
    );
}
