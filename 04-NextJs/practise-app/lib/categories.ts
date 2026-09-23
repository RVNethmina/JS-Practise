import type { Category } from "./types";
import { DELAYS, sleep, readJson } from "./db-core";

export async function getCategories(): Promise<Category[]> {
  await sleep(DELAYS.fast);
  return readJson<Category[]>("categories.json");
}

export async function getCategory(slug: string): Promise<Category | null> {
  await sleep(DELAYS.fast);

  const categories = await readJson<Category[]>("categories.json");
  return categories.find((c) => c.slug === slug) ?? null;
}
