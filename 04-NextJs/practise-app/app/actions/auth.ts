"use server";

import { FormState } from "@/lib/form";
import { getUserByEmail } from "@/lib/users";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LoginAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    const email = formData.get("email");
    const password = formData.get("password");

    const values = {
        email: typeof email === "string" ? email : "",
    };

    if (typeof email !== "string" || !email.includes("@")) {
        return {
            errors: { email: ["Please enter a valid email"] },
            values,
        };
    }

    if (typeof password !== "string" || !password) {
        return {
            errors: { password: ["Please enter your password"] },
            values,
        };
    }

    const user = await getUserByEmail(email);

    if (!user || user.passwordHash !== password) {
        return {
            errors: { form: ["Invalid email or password"] },
            values,
        };
    }

    const cookieStore = await cookies();
    cookieStore.set("session", user.id, {
        // httpOnly: page JavaScript can't read it, so an XSS attack can't steal it
        httpOnly: true,
        // secure: only sent over HTTPS in production (localhost is plain HTTP)
        secure: process.env.NODE_ENV === "production",
        // sameSite: not sent on requests from other sites, which blocks CSRF
        sameSite: "lax",
        // maxAge: expires after 24 hours, so a stolen cookie doesn't live forever
        maxAge: 60 * 60 * 24,
    });

    redirect("/dashboard");
}
