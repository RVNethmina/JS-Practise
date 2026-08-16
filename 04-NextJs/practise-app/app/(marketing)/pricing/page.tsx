import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing",
    description: "Simple pricing, no surprises.",
};

export default function PricingPage() {
    return (
        <div>
            <h1>Pricing</h1>
            <p>Everything is priced in cents and displayed in dollars.</p>
        </div>
    );
}
