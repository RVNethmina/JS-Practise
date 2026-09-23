import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const DELAYS = {
  fast: 300,
  slow: 4000,
} as const;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DATA_DIR = path.join(process.cwd(), "data");

export async function readJson<T>(filename: string): Promise<T> {
  const raw = await readFile(path.join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  await writeFile(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

// A switch for breaking the data layer on purpose.
// Needed by Phase 6 Problem 7 (handling failures) and all of Phase 7
// (error.tsx, retry). Flip it, reload, watch what happens.
export let shouldFail = false;
export function setShouldFail(v: boolean) { shouldFail = v; }

// Call this at the top of any read to make it throw when the switch is on.
export function failIfAsked(where: string): void {
  if (shouldFail) {
    throw new Error(`Simulated database failure in ${where}`);
  }
}
