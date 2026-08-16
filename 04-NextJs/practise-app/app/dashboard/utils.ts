// This file exists to prove a point.
//
// It sits inside app/dashboard/, which IS a route folder — but this file is not
// named page.tsx, so it is NOT reachable as a URL.
//
// Visit /dashboard/utils and you get a 404.
//
// That's what lets you keep helper files next to the page that uses them
// (called "colocation") without them accidentally becoming public pages.

export function formatCents(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}
