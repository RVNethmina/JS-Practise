/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 4, PROBLEM 5 — Controlled form

   "Controlled" just means: React holds the text, not the input box.

   You type a letter → onChange fires → setName() → React redraws →
   the input shows the new value. Every keystroke does a full round trip
   through React. That's why it's called controlled.

   THE POINT OF THIS PROBLEM
   Finish it, then turn JavaScript OFF in devtools and try again.
   Nothing will happen. Not "it breaks" — nothing at all.

   Remember that feeling. In Phase 10 you rebuild this exact form with a
   Server Action and it keeps working with JavaScript off.
   ═══════════════════════════════════════════════════════════════════════════ */

"use client";

import { useState } from "react";

// One place to describe what can go wrong.
// The `?` on each line means "this might not be here" — if the name is fine,
// there's simply no `name` key in the object.
type FormErrors = {
    name?: string;
    email?: string;
    message?: string;
};

export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // Was: useState("") holding one error string.
    // Now an object, so each field can have its own message.
    // Starts as {} — an empty object, meaning "nothing wrong yet".
    const [errors, setErrors] = useState<FormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        // Stops the browser doing its own old-school form submit,
        // which would reload the whole page.
        event.preventDefault();

        // ── Check the fields ────────────────────────────────────────────────
        // Build up an object of problems as we go.
        const nextErrors: FormErrors = {};

        if (!name.trim()) {
            nextErrors.name = "Please enter your name.";
        }

        if (!email.trim()) {
            nextErrors.email = "Please enter your email.";
        } else if (!email.includes("@")) {
            // Deliberately a very loose check. Properly validating an email
            // address is famously hard, and it doesn't matter much here —
            // in Phase 10 the SERVER checks it, which is the check that counts.
            nextErrors.email = "That doesn't look like an email address.";
        }

        if (!message.trim()) {
            nextErrors.message = "Please write a message.";
        }

        // Object.keys({}) gives [] — length 0 — so this means "found problems".
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return; // stop here, don't submit
        }

        // ── All good ────────────────────────────────────────────────────────
        // Wipe any old errors. Without this line, a message from a previous
        // failed attempt would stay on screen forever.
        setErrors({});

        setIsSubmitting(true);

        // Pretend to send it to a server. There's no real backend yet —
        // this just waits one second so you can see the button change.
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Put it back to false. Your version was missing this, so the button
        // would have stayed stuck on "Sending..." forever.
        setIsSubmitting(false);
        setIsSent(true);

        // Empty the boxes, ready for another message.
        setName("");
        setEmail("");
        setMessage("");
    }

    // Sent successfully? Show a thank-you instead of the form.
    if (isSent) {
        return (
            <div>
                <p>Thanks — your message was sent.</p>
                <button type="button" onClick={() => setIsSent(false)}>
                    Send another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            {/* ── Name ────────────────────────────────────────────────────── */}
            <div className="field">
                {/* htmlFor must match the input's id. It means clicking the
                    words "Your name" puts the cursor in the box. */}
                <label htmlFor="contact-name">Your name</label>
                <input
                    id="contact-name"
                    // `name` isn't needed for a controlled form like this one.
                    // It's here because in Phase 10 the server reads fields BY
                    // this name — worth getting into the habit now.
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                {/* Show the error only if there is one.
                    `errors.name && (...)` means "if errors.name exists, show this". */}
                {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            {/* ── Email ───────────────────────────────────────────────────── */}
            <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            {/* ── Message ─────────────────────────────────────────────────── */}
            <div className="field">
                <label htmlFor="contact-message">Message</label>
                {/* A textarea, not <input type="text">. Same idea, but it grows
                    to several lines — right for a paragraph of text. */}
                <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />
                {errors.message && <p className="field-error">{errors.message}</p>}
            </div>

            {/* disabled={isSubmitting} stops double-clicks sending it twice. */}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send message"}
            </button>
        </form>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THE EXPERIMENT — do this one, it's the whole point

   1. Open devtools (F12)
   2. Press Ctrl+Shift+P, type "Disable JavaScript", press Enter
   3. Reload /contact
   4. Fill in the form and press Send

   NOTHING HAPPENS. No error, no message, no reload. Completely dead.

   Why: every single piece of this form is JavaScript. The onChange handlers,
   the useState, the validation, handleSubmit — all of it needs JS running.
   Take JS away and it's just a decoration.

   Turn JavaScript back on the same way.

   Keep this in mind. Phase 10 Problem 1 builds the same thing with a Server
   Action, and that version still works with JavaScript off.

   ───────────────────────────────────────────────────────────────────────────
   TWO SMALL THINGS

   `noValidate` on the <form>
       Turns off the browser's own built-in validation popups, so you can see
       YOUR error messages instead of Chrome's.

   `.trim()`
       Removes spaces from the ends. Without it, typing a single space would
       count as a valid name.

   ───────────────────────────────────────────────────────────────────────────
   ONE THING REAL CODE DOES DIFFERENTLY

   Here we do:
       setIsSubmitting(true);
       await ...;
       setIsSubmitting(false);

   If the await threw an error, that last line never runs and the button stays
   stuck. Real code wraps it in try/finally so the reset always happens.

   Left simple here on purpose — there's no real server to fail yet.
   ═══════════════════════════════════════════════════════════════════════════ */
