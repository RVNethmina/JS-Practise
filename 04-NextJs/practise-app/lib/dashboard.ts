import type { Product, User, Category, Post } from "./types";
import { DELAYS, sleep, readJson } from "./db-core";

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

export type AnalyticsSummary = {
  pageViews: number;
  conversionRate: number;
  topReferrer: string;
};

export async function getAnalytics( options: { fail?: boolean } = {} ): Promise<AnalyticsSummary> {

  await sleep(DELAYS.fast);
  if(options.fail) throw new Error("Analytics provider timed out")

  return {
    pageViews: 12,
    conversionRate: 0.5,
    topReferrer: "Me"
  }
}

let analyticsAttempts = 0;

export async function getFlakyAnalytics(): Promise<AnalyticsSummary> {
 analyticsAttempts++;
 await sleep(DELAYS.fast);

 if (analyticsAttempts <= 2 ){
  throw new Error(`Analytics timed out (attempt ${analyticsAttempts})`);
 }

 return {pageViews: 12043, conversionRate: 2.4, topReferrer: "google.com"};
}
