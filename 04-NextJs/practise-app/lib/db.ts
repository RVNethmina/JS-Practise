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


const DELAYS = {
  fast: 300,
  slow: 2000,
} as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DATA_DIR = path.join(process.cwd(), "data");


async function readJson<T>(filename: string): Promise<T> {
  const raw = await readFile(path.join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as T;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const PRODUCT_PAGE_SIZE_DEFAULT = 8;
const PRODUCT_PAGE_SIZE_MAX = 50;


// Filter → sort → paginate, in that order. Every option is optional, so
// `getProducts()` with no arguments returns page 1 of everything.
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductListResult> {
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


export async function getProduct(id: string): Promise<Product | null> {
  await sleep(DELAYS.fast);

  const products = await readJson<Product[]>("products.json");
  return products.find((p) => p.id === id) ?? null;
}


// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------


export async function getCategories(): Promise<Category[]> {
  await sleep(DELAYS.fast);
  return readJson<Category[]>("categories.json");
}


export async function getCategory(slug: string): Promise<Category | null> {
  await sleep(DELAYS.fast);

  const categories = await readJson<Category[]>("categories.json");
  return categories.find((c) => c.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------


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

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Docs
// ---------------------------------------------------------------------------


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



export type DashboardStats = {
  totalProducts: number;
  totalUsers: number;
  totalPosts: number;
  outOfStock: number;
};

export async function getStats(): Promise<DashboardStats> {
  await sleep(800);

  const products = await readJson<Product[]>("products.json");
  const users = await readJson<User[]>("users.json");
  const posts = await readJson<Post[]>("posts.json");

  return {
    totalProducts: products.length,
    totalUsers: users.length,
    totalPosts: posts.length,
    outOfStock: products.filter((p) => !p.inStock).length,
  };
}

export type RecentOrder = {
  id: string;
  productName: string;
  customer: string;
  total: number;
  placedAt: string;
  category: string;
};

export async function getRecentOrders(): Promise<RecentOrder[]> {
  await sleep(1200); // the slowest one

  const products = await readJson<Product[]>("products.json");
  const users = await readJson<User[]>("users.json");
  const categories = await readJson<Category[]>("categories.json");

  return products.map((product, i) => {
    const category = categories.find((c) => c.id === product.categoryId);

    const daysAgo = (i * 7) % 30;
    const placed = new Date("2026-08-21T12:00:00.000Z");
    placed.setUTCDate(placed.getUTCDate() - daysAgo);

    return {
      id: `order-${i + 1}`,
      productName: product.name,
      customer: users[i % users.length].name,
      total: product.price,
      placedAt: placed.toISOString(),
      category: category?.name ?? "Uncategorised",
    };
  });
}

export type Notification = {
  id: string;
  message: string;
  read: boolean;
};

export async function getNotifications(): Promise<Notification[]> {
  await sleep(600);

  const products = await readJson<Product[]>("products.json");

  return products
    .filter((p) => !p.inStock)
    .map((p, i) => ({
      id: `notif-${i + 1}`,
      message: `${p.name} is out of stock`,
      read: i > 0,
    }));
}


export type SalesRecord = {
  id: number;
  productId: string;
  quantity: number;
  unitPrice: number;
  soldAt: string;
  region: "north" | "south" | "east" | "west";
};

const REGIONS = ["north", "south", "east", "west"] as const;

export async function getSalesRecords(): Promise<SalesRecord[]> {
  await sleep(DELAYS.fast);

  const products = await readJson<Product[]>("products.json");
  const records: SalesRecord[] = [];

  // Deterministic pseudo-random so the numbers are stable between reloads.
  let seed = 12345;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  for (let i = 0; i < 10_000; i++) {
    const product = products[Math.floor(rand() * products.length)];
    const daysAgo = Math.floor(rand() * 365);
    const date = new Date(2026, 0, 1);
    date.setDate(date.getDate() - daysAgo);

    records.push({
      id: i + 1,
      productId: product.id,
      quantity: 1 + Math.floor(rand() * 5),
      unitPrice: product.price,
      soldAt: date.toISOString(),
      region: REGIONS[Math.floor(rand() * REGIONS.length)],
    });
  }

  return records;
}
