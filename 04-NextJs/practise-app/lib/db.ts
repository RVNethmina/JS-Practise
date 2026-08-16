/**
 * This module is server-only: it uses `node:fs`, so importing it into a
 * Client Component or into middleware (Edge runtime) will fail. That failure
 * is a Phase 13 exercise — don't work around it.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  GetProductsOptions,
  Product,
  ProductListResult,
  Category,
  Post,
  User,
  PublicUser,
  Doc
} from "./types";

// ---------------------------------------------------------------------------
// Artificial latency
// ---------------------------------------------------------------------------
// Real databases are slow. This one isn't, which would make loading.tsx,
// Suspense fallbacks, and streaming completely invisible — Phases 7 and 9
// would teach you nothing.
//
// Tune these if dev gets painful, but do not remove them.

const DELAYS = {
  fast: 300,
  slow: 2000,
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// File reading
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * `JSON.parse` returns `any`, which would spread untyped through everything
 * downstream. The generic here is an unchecked ASSERTION, not a guarantee:
 * it says "trust me, the file has this shape."
 *
 * That is acceptable because these files are yours and version-controlled.
 * For data crossing a real trust boundary — a request body, a third-party
 * API — you would validate at runtime with a schema library instead.
 * Phase 14, Problem 2 revisits this.
 */
async function readJson<T>(filename: string): Promise<T> {
  const raw = await readFile(path.join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as T;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const PRODUCT_PAGE_SIZE_DEFAULT = 8;
const PRODUCT_PAGE_SIZE_MAX = 50;

/**
 * Read, filter, sort, and paginate products.
 *
 * Deliberately slow — this is one of the two 2000ms functions. It's what
 * makes the products route's loading skeleton actually appear.
 */
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductListResult> {
  await sleep(DELAYS.slow);

  const all = await readJson<Product[]>("products.json");

  // --- filter -------------------------------------------------------------
  let items = all;

  if (options.category) {
    // Categories are addressed by slug in URLs but stored by id on the
    // product, so this needs the category lookup to resolve one to the other.
    const categories =
      await readJson<{ id: string; slug: string }[]>("categories.json");
    const match = categories.find((c) => c.slug === options.category);

    // An unknown category is an empty result, not an error. The route layer
    // decides whether that means notFound() or an empty state.
    items = match ? items.filter((p) => p.categoryId === match.id) : [];
  }

  if (options.search) {
    const needle = options.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle)
    );
  }

  if (options.tag) {
    items = items.filter((p) => p.tags.includes(options.tag!));
  }

  if (options.inStockOnly) {
    items = items.filter((p) => p.inStock);
  }

  // --- sort ---------------------------------------------------------------
  // Copy before sorting: Array.sort mutates in place, and `items` may still
  // be pointing at the array returned by readJson.
  const sorted = [...items];
  switch (options.sort ?? "newest") {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }

  // --- paginate -----------------------------------------------------------
  // Both values are clamped. `page` and `pageSize` ultimately come from the
  // query string, which is attacker-controlled — an unclamped `?pageSize=999999`
  // is a free denial-of-service against your own data layer. Phase 8 asks you
  // to explain this.
  const total = sorted.length;
  const pageSize = Math.min(
    Math.max(1, Math.floor(options.pageSize ?? PRODUCT_PAGE_SIZE_DEFAULT)),
    PRODUCT_PAGE_SIZE_MAX
  );
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, Math.floor(options.page ?? 1)), totalPages);

  const start = (page - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}

// ---------------------------------------------------------------------------
// YOUR TURN
// ---------------------------------------------------------------------------
// Suggested signatures. Add them as the phases demand — don't write them all
// now. `getProduct` and `getCategories` are the two Phase 1 and 3 need first.
//
// Use DELAYS.fast for everything except one dashboard function, which should
// use DELAYS.slow so Phase 9's streaming exercise has something to wait on.
//
// Return `null` rather than throwing when a single item isn't found. The route
// decides what a miss means — usually notFound(), but not always.
//
//   getProduct(id: string): Promise<Product | null>
//   getProductBySlug(slug: string): Promise<Product | null>
//   getCategories(): Promise<Category[]>
//   getCategory(slug: string): Promise<Category | null>
//   getPosts(): Promise<Post[]>
//   getPost(slug: string): Promise<Post | null>
//   getUsers(): Promise<User[]>
//   getUser(username: string): Promise<User | null>
//   getDoc(slug: string[]): Promise<Doc | null>
//
// Writes arrive in Phase 10. They need `writeFile`, and they must read,
// modify, and write the whole array back:
//
//   createProduct(data: Omit<Product, "id" | "createdAt">): Promise<Product>
//   updateProduct(id: string, data: Partial<Product>): Promise<Product | null>
//   deleteProduct(id: string): Promise<boolean>

// ===========================================================================
// WORKED EXAMPLE — getProduct
// ===========================================================================
// Every single-item read in this file is the same four steps:
//
//   1. await sleep(...)          artificial latency
//   2. readJson<T[]>(file)       load the whole array
//   3. .find(predicate)          locate the one you want
//   4. return it ?? null         normalise "missing" to null
//
// Once you can write this one from memory, the rest are the same shape with a
// different file and a different predicate.

export async function getProduct(id: string): Promise<Product | null> {
  await sleep(DELAYS.fast);

  const products = await readJson<Product[]>("products.json");

  // `.find` returns `Product | undefined` — undefined when nothing matches.
  // `?? null` converts that to null so the whole data layer speaks one
  // "missing" language. Mixing undefined and null across functions means
  // every caller has to remember which one this particular function uses.
  return products.find((p) => p.id === id) ?? null;
}


// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

// The simplest kind: read the file, hand back the whole list.
// No searching, so nothing can be "missing", so no `| null`.
export async function getCategories(): Promise<Category[]> {
  await sleep(DELAYS.fast);
  return readJson<Category[]>("categories.json");
}

// Find one category by its slug (the bit that appears in the URL).
// Same shape as getProduct, different file and different field.
export async function getCategory(slug: string): Promise<Category | null> {
  await sleep(DELAYS.fast);

  const categories = await readJson<Category[]>("categories.json");
  return categories.find((c) => c.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

// Newest post first. `.sort` changes the array in place, so we copy it first
// with [...posts]. (Mutating the array you just read is fine here, but it's a
// habit worth having — later this array might be shared.)
//
// b.publishedAt.localeCompare(a.publishedAt) compares the two date strings
// alphabetically. Because they're ISO dates ("2026-03-14T09:00:00.000Z"),
// alphabetical order IS date order. That's the whole reason we store dates
// as ISO strings.
export async function getPosts(): Promise<Post[]> {
  await sleep(DELAYS.fast);

  const posts = await readJson<Post[]>("posts.json");
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

// Blog URLs look like /blog/why-we-rebuilt-our-storefront, so we match on
// `slug`, not `id`.
export async function getPost(slug: string): Promise<Post | null> {
  await sleep(DELAYS.fast);

  const posts = await readJson<Post[]>("posts.json");
  return posts.find((p) => p.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
//
// users.json contains passwordHash. Anything these functions return could end
// up rendered into a page and sent to the browser, so we strip the password
// here — once, in one place — rather than remembering to do it at every call
// site. That's what the PublicUser type is for.

// Takes a full User and returns a copy without passwordHash.
// The `...rest` bit means "everything else" — so we pull passwordHash out and
// keep the remainder. This is normal JavaScript destructuring.
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

  // Only convert if we actually found someone.
  return user ? toPublicUser(user) : null;
}

// The ONE exception. Logging in needs to compare passwords, so this returns
// the full User including passwordHash. Only the login action should call it.
// Phase 12 uses this.
export async function getUserByEmail(email: string): Promise<User | null> {
  await sleep(DELAYS.fast);

  const users = await readJson<User[]>("users.json");
  return users.find((u) => u.email === email) ?? null;
}

// ---------------------------------------------------------------------------
// Docs
// ---------------------------------------------------------------------------

// This one's different because we're comparing two ARRAYS, not two strings.
//
// You can't write  slugA === slugB  for arrays. In JavaScript, === on arrays
// asks "are these the exact same object in memory?", not "do they contain the
// same things". Two arrays built separately are never ===, even if identical:
//
//   ["a", "b"] === ["a", "b"]   ->  false
//
// The easy fix: turn both arrays into a single string, then compare those.
//
//   ["a", "b"].join("/")   ->  "a/b"
//   [].join("/")           ->  ""        <- the bare /docs page
//
// Now it's a normal string comparison and it works.
export async function getDoc(slug: string[]): Promise<Doc | null> {
  await sleep(DELAYS.fast);

  const docs = await readJson<Doc[]>("docs.json");
  const wanted = slug.join("/");

  return docs.find((d) => d.slug.join("/") === wanted) ?? null;
}
