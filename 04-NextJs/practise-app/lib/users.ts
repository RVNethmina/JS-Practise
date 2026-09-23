import type { User, PublicUser, Role } from "./types";
import { DELAYS, sleep, readJson, writeJson } from "./db-core";

function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function getUsers(): Promise<PublicUser[]> {
  await sleep(DELAYS.fast);

  const users = await readJson<User[]>("users.json");
  return users.map(toPublicUser);
}

export async function getUser(username: string): Promise<PublicUser | null> {
  await sleep(DELAYS.fast);

  const users = await readJson<User[]>("users.json");
  const user = users.find((u) => u.username === username);

  return user ? toPublicUser(user) : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await sleep(DELAYS.fast);

  const users = await readJson<User[]>("users.json");
  return users.find((u) => u.email === email) ?? null;
}

export async function createUser(
  input: { username: string; name: string; email: string; role: Role }
): Promise<PublicUser> {
  // 1. Read the current list. Every write is read -> change -> write back.
  const users = await readJson<User[]>("users.json");

  // 2. Make an id: highest existing number + 1. Using users.length would
  //    collide after a delete, because length is not a counter.
  const highest = users.reduce(
    (max, u) => Math.max(max, Number(u.id.slice(2)) || 0),
    0
  );

  // 3. Build a full User. Note it needs passwordHash, which `input` hasn't got.
  const user: User = {
    id: `u-${highest + 1}`,
    username: input.username,
    name: input.name,
    email: input.email,
    passwordHash: "changeme",
    role: input.role,
    createdAt: new Date().toISOString(),
  };

  // 4. Append and save the whole file back.
  await writeJson("users.json", [...users, user]);

  // 5. Return WITHOUT the password — that's what PublicUser promises.
  return toPublicUser(user);
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<User, "name" | "email">>
): Promise<PublicUser | null> {
  const users = await readJson<User[]>("users.json");
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  const updated: User = { ...users[index], ...patch };
  const next = [...users];
  next[index] = updated;
  await writeJson("users.json", next);
  return toPublicUser(updated);
}
