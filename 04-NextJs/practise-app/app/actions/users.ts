"use server";

import { createUser } from "@/lib/users";
import { Role } from "@/lib/types";
import { redirect } from "next/navigation";

const ROLES: Role[] = ["admin", "editor", "viewer"];

export async function createUserAction(formData: FormData) {

    const username = formData.get("username");
    const name = formData.get("name");
    const email = formData.get("email");
    const role = formData.get("role");

    if (typeof username !== "string" || !username.trim()) {
        return;
    }
    if (typeof name !== "string" || !name.trim()) {
        return;
    }
    if (typeof email !== "string" || !email.trim()) {
        return;
    }
    if (typeof role !== "string" || !ROLES.includes(role as Role)) {
        return;
    }

    await createUser({ username, name, email, role: role as Role });

    redirect("/users");
}
