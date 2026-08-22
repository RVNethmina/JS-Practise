import { getUsers } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";
import type { PublicUser } from "@/lib/types";

export const metadata: Metadata = {
    title: "Users",
};

export default async function UsersPage() {
    const users: PublicUser[] = await getUsers();

    if (users.length === 0) {
        return (
            <main>
                <h1>Users</h1>
                <p>No users yet.</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Users</h1>
            <p>{users.length} users</p>

            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link href={`/users/${user.username}`}>{user.name}</Link>
                        {" — "}
                        <small>
                            @{user.username} · {user.role}
                        </small>
                    </li>
                ))}
            </ul>
        </main>
    );
}
