"use server";

import { updateUser } from "@/lib/users";
import { FormState } from "@/lib/form";

export async function updateProfileAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    const name = formData.get("name");
    const email = formData.get("email");

    const values = {
        name: typeof name === "string" ? name : "",
        email: typeof email === "string" ? email : "",
    };

    if (typeof name !== "string" || !name.trim()) {
        return {
            errors: { name: ["Please enter a valid name"] },
            values,
        };
    }

    if (typeof email !== "string" || !email.includes("@")) {
        return {
            errors: { email: ["Please enter a valid email address"] },
            values,
        };
    }

    await updateUser("u-1", { name, email });

    return { message: "Saved!" };
}
