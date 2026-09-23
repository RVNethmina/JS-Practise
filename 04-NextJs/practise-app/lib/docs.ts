import type { Doc } from "./types";
import { DELAYS, sleep, readJson } from "./db-core";

// Every doc, unsorted. Needed by generateStaticParams, which has to know the
// full list of paths before it can pre-build them.
export async function getDocs(): Promise<Doc[]> {
  await sleep(DELAYS.fast);
  return readJson<Doc[]>("docs.json");
}

// `slug` is a string ARRAY, not a string, because it comes from the catch-all
// route [[...slug]]. /docs/guides/deployment arrives as ["guides","deployment"].
export async function getDoc(slug: string[]): Promise<Doc | null> {
  // 1. Fake latency, same as every other read here.
  await sleep(DELAYS.fast);

  // 2. Load all 8 docs. Each one stores its own path as an array too.
  const docs = await readJson<Doc[]>("docs.json");

  // 3. Flatten the requested path into one string: ["guides","deployment"] → "guides/deployment".
  //    Bare /docs gives [] which joins to "" — and the index doc's slug is [], so it matches.
  const wanted = slug.join("/");

  // 4. Flatten each stored path the same way and compare.
  //    Why join instead of comparing the arrays directly? In JavaScript
  //    ["a"] === ["a"] is FALSE — arrays compare by identity, not contents.
  //    Two strings compare by value, so joining makes === work.
  //    `?? null` turns .find()'s undefined into null, matching every other getter.
  return docs.find((d) => d.slug.join("/") === wanted) ?? null;
}
