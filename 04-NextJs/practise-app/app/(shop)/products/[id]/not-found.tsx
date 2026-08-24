import Link from "next/link";

export default function NotFound() {
    return (
        <div>
            <h1>Product not Found!</h1>
            <p>That product doesn&apos;t exist or has been removed.</p>
            <Link href="/products">Back to all products</Link>
        </div>
    );
}
