import type { Post } from "./types";
import { DELAYS, sleep, readJson } from "./db-core";

export async function getPosts(): Promise<Post[]> {
  await sleep(DELAYS.fast);

  const posts = await readJson<Post[]>("posts.json");
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPost(slug: string): Promise<Post | null> {
  await sleep(DELAYS.fast);

  const posts = await readJson<Post[]>("posts.json");
  return posts.find((p) => p.slug === slug) ?? null;
}

// Posts by one author. Needs a USER ID, which you only get by fetching the
// user first — so this is a genuinely dependent fetch, not a fake one.
// That dependency is the whole point of Phase 6, Problem 6.
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  await sleep(DELAYS.fast);

  const posts = await readJson<Post[]>("posts.json");
  return posts
    .filter((p) => p.authorId === authorId)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
