import { cache } from "react";

import type {
  GetProductsOptions,
  Product,
  ProductListResult,
} from "./types";
import { DELAYS, sleep, readJson, writeJson, failIfAsked } from "./db-core";

const PRODUCT_PAGE_SIZE_DEFAULT = 8;
const PRODUCT_PAGE_SIZE_MAX = 50;

// Filter → sort → paginate, in that order. Every option is optional, so
// `getProducts()` with no arguments returns page 1 of everything.
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductListResult> {
  // 0. Break on demand, for the error-handling exercises.
  failIfAsked("getProducts");

  // 1. Fake a slow database. Without this, loading.tsx and Suspense are invisible.
  await sleep(DELAYS.slow);

  // 2. Read the whole file. A real database would filter before returning;
  //    with a JSON file we load everything and narrow it down in memory.
  const all = await readJson<Product[]>("products.json");

  // 3. `items` shrinks with each filter below. `let` because we reassign it.
  let items = all;

  // 4. Category. URLs use the slug ("electronics") but products store categoryId
  //    ("cat-electronics"), so look up the id first. Unknown slug → empty list,
  //    not an error; the page decides whether that means notFound().
  if (options.category) {
    const categories =
      await readJson<{ id: string; slug: string }[]>("categories.json");
    const match = categories.find((c) => c.slug === options.category);
    items = match ? items.filter((p) => p.categoryId === match.id) : [];
  }

  // 5. Search. Lowercase both sides so "HEADphones" matches "Headphones".
  if (options.search) {
    const needle = options.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle)
    );
  }

  // 6. Tag. The `!` after options.tag is a non-null assertion: the `if` above
  //    proves it exists, but TypeScript forgets that inside the callback.
  if (options.tag) {
    items = items.filter((p) => p.tags.includes(options.tag!));
  }

  // 7. Stock.
  if (options.inStockOnly) {
    items = items.filter((p) => p.inStock);
  }

  // 8. Sort a COPY. .sort() rearranges the array in place, and `items` may still
  //    point at the array readJson returned.
  // take copy of items using spread operator
  const sorted = [...items];
  switch (options.sort ?? "newest") {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name":
      // localeCompare gives proper alphabetical order, including accents.
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      // createdAt is an ISO string, so alphabetical order IS date order.
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
  }

  // 9. Clamp pageSize between 1 and the max. This is the real safety check:
  //    pageSize comes from the query string, and an unclamped ?pageSize=999999999
  //    lets any visitor make the server do unlimited work.
  const total = sorted.length;
  const pageSize = Math.min(
    Math.max(1, Math.floor(options.pageSize ?? PRODUCT_PAGE_SIZE_DEFAULT)),
    PRODUCT_PAGE_SIZE_MAX
  );

  // 10. Clamp page to a real page. ?page=999 lands on the last one, not an error.
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, Math.floor(options.page ?? 1)), totalPages);

  // 11. Cut out this page's slice. Page 1 starts at 0, page 2 at pageSize, etc.
  const start = (page - 1) * pageSize;

  // 12. Return the items AND the counts, so the page can draw pagination
  //     controls without asking a second time.
  return {
    items: sorted.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}

export const getProduct = cache( async(id: string): Promise<Product | null> => {
  console.log("DB HIT", id);

  await sleep(DELAYS.fast);

  const products = await readJson<Product[]>("products.json");
  return products.find((p) => p.id === id) ?? null;
});

export async function createProduct(
  input: Omit<Product, "id" | "createdAt" | "variants">
): Promise<Product>{

  const products = await readJson<Product[]>("products.json")

  const highest = products.reduce(
    (max, p) => Math.max(max, Number(p.id.slice(2)) || 0),
    0
  );

  const product: Product = {
    id: `p-${highest + 1}`,
    slug: input.slug,
    name: input.name,
    description: input.description,
    price: input.price,
    categoryId: input.categoryId,
    tags: input.tags,
    inStock: input.inStock,
    createdAt: new Date().toISOString(),
    variants: [],
  };

  await writeJson("products.json", [...products, product]);

  return product;
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<Product, "id">>
): Promise<Product | null> {
  const products = await readJson<Product[]>("products.json");

  // 1. findIndex, not find — we need the position to put the new one back.
  const index = products.findIndex((p) => p.id === id);

  // 2. -1 means no match. Return null so the caller can send a 404.
  if (index === -1) return null;

  // 3. Merge. Spread order matters: patch is second, so its keys win and
  //    every other field survives. Omit<Product,"id"> stops a patch
  //    rewriting the id.
  const updated: Product = { ...products[index], ...patch };

  // 4. Replace that one entry, leave the rest alone.
  const next = [...products];
  next[index] = updated;

  await writeJson("products.json", next);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readJson<Product[]>("products.json");

  // 1. Keep everything except the one being removed.
  const next = products.filter((p) => p.id !== id);

  // 2. filter never says whether it removed anything — comparing lengths is
  //    how you find out. Same length = the id wasn't there.
  if (next.length === products.length) return false;

  await writeJson("products.json", next);
  return true;
}

// A deliberately unreliable "recommendations service", for Phase 6 Problem 7.
//
// Failure is a per-call ARGUMENT here, not the global shouldFail switch.
// That matters: shouldFail is module state on the server, so flipping it would
// break every page at once and stay broken. Passing `fail` keeps the blast
// radius to one request, which is what you want for an experiment.
export async function getRecommendations(
  options: { fail?: boolean } = {}
): Promise<Product[]> {
  await sleep(DELAYS.fast);

  if (options.fail) {
    throw new Error("Recommendation service unavailable");
  }

  const products = await readJson<Product[]>("products.json");
  return products.filter((p) => p.tags.includes("bestseller")).slice(0, 3);
}
