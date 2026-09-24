"use server";

import { FormState } from "@/lib/form";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 1000;

export async function contactAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const values = {
        name: typeof name === "string" ? name : "",
        email: typeof email === "string" ? email : "",
        message: typeof message === "string" ? message : "",
    };

    const errors: Record<string, string[]> = {};

    if (typeof name !== "string" || !name.trim()) {
        errors.name = ["Please enter your name."];
    }

    if (typeof email !== "string" || !email.trim()) {
        errors.email = ["Please enter your email."];
    } else if (!EMAIL_PATTERN.test(email.trim())) {
        errors.email = ["That doesn't look like an email address."];
    }

    if (typeof message !== "string" || !message.trim()) {
        errors.message = ["Please write a message."];
    } else if (message.length > MESSAGE_MAX) {
        errors.message = [`Message must be ${MESSAGE_MAX} characters or fewer.`];
    }

    if (Object.keys(errors).length > 0) {
        return { errors, values };
    }

    return { message: "Thanks — your message was sent." };
}
