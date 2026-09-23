import { apiError } from "@/lib/api";
import { createUser, getUsers } from "@/lib/users";
import { Role } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {

    const users = await getUsers();
    return NextResponse.json(users, { status: 200 })
}

const ROLES: Role[] = ["admin", "editor", "viewer"];

export async function POST(request: Request) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return apiError("Invalid JSON body", 400);
    }

    if (typeof body.username !== "string" || body.username.trim() === "") {
        return apiError("username must be a non-empty string", 400);
    }
    if (typeof body.name !== "string" || body.name.trim() === "") {
        return apiError("name must be a non-empty string", 400);
    }
    if (typeof body.email !== "string" || body.email.trim() === "") {
        return apiError("email must be a non-empty string", 400);
    }
    if (typeof body.role !== "string" || !ROLES.includes(body.role as Role)) {
        return apiError("role must be one of admin, editor, viewer", 400);
    }

    const user = await createUser({
        username: body.username,
        name: body.name,
        email: body.email,
        role: body.role as Role,
    });

    return NextResponse.json(user, { status: 201 });
}
