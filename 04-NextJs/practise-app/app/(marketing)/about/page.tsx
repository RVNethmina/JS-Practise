import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "The story behind the store.",
};

export default function AboutPage() {
    return (
        <div>
            <h1>About Us</h1>
            <p>We sell things that last longer than they need to.</p>
        </div>
    );
}
