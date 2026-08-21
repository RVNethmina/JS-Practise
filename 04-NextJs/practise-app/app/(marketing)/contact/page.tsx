import type { Metadata } from "next";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
    title: "Contact",
};

/* This page was missing, which is why /contact was a 404 and the form had
   never actually rendered.

   Note there's no "use client" here. This page is a Server Component — it
   ships no JavaScript. Only ContactForm does, because only ContactForm needs
   to be interactive.

   Same split as the products page: server on the outside, client only where
   something has to react to a click or a keystroke. */

export default function ContactPage() {
    return (
        <main>
            <h1>Contact us</h1>
            <p>Send us a message and we&apos;ll get back to you.</p>
            <ContactForm />
        </main>
    );
}
