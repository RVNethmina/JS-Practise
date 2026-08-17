import { getUsers } from "@/lib/db";

export default async function UserPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>All users</h1>
      {users.map((user) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}
