"use client";

import { contactAction } from "@/app/actions/contact";
import SubmitButton from "@/app/admin/products/_components/SubmitButton";
import { emptyFormState } from "@/lib/form";
import { useActionState, useState } from "react";

type FormErrors = {
    name?: string;
    email?: string;
    message?: string;
};

export default function ContactForm() {
    const [state, formAction] = useActionState(contactAction, emptyFormState);
    const [clientErrors, setClientErrors] = useState<FormErrors>({});

    // Fast feedback only. The server re-checks everything, so skipping or
    // deleting this in devtools gets you nothing.
    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") ?? "");
        const email = String(data.get("email") ?? "");
        const message = String(data.get("message") ?? "");

        const nextErrors: FormErrors = {};

        if (!name.trim()) {
            nextErrors.name = "Please enter your name.";
        }

        if (!email.trim()) {
            nextErrors.email = "Please enter your email.";
        } else if (!email.includes("@")) {
            nextErrors.email = "That doesn't look like an email address.";
        }

        if (!message.trim()) {
            nextErrors.message = "Please write a message.";
        }

        if (Object.keys(nextErrors).length > 0) {
            event.preventDefault();
            setClientErrors(nextErrors);
            return;
        }

        setClientErrors({});
    }

    const nameError = clientErrors.name ?? state.errors?.name?.[0];
    const emailError = clientErrors.email ?? state.errors?.email?.[0];
    const messageError = clientErrors.message ?? state.errors?.message?.[0];

    return (
        <form action={formAction} onSubmit={handleSubmit} noValidate>
            {state.message && <p>{state.message}</p>}

            <div className="field">
                <label htmlFor="contact-name">Your name</label>
                <input
                    id="contact-name"
                    name="name"
                    type="text"
                    defaultValue={state.values?.name}
                />
                {nameError && <p className="field-error">{nameError}</p>}
            </div>

            <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    defaultValue={state.values?.email}
                />
                {emailError && <p className="field-error">{emailError}</p>}
            </div>

            <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    maxLength={1000}
                    defaultValue={state.values?.message}
                />
                {messageError && <p className="field-error">{messageError}</p>}
            </div>

            <SubmitButton label="Send message" pendingLabel="Sending..." />
        </form>
    );
}
