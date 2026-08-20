/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 4, PROBLEM 2 — put the search term in the URL

   Compare with ProductFilter.tsx, which does the "same" job the opposite way:

     ProductFilter          state lives in useState   → URL never changes
     SearchBox (this file)  state lives in the URL    → /products?q=headphones

   Why the URL is worth the extra work:
     • refresh the page  → your search survives
     • copy the link     → your friend sees the same filtered view
     • press Back        → you go to the previous search
     • the SERVER can read it (searchParams) — useState is invisible to it

   The URL becomes a piece of state that is shared, bookmarkable, and readable
   from the server. That's the whole idea.
   ═══════════════════════════════════════════════════════════════════════════ */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SearchBox() {
    // ── The three hooks, and what each one is for ────────────────────────────
    //
    //   useSearchParams()  READ  the ?q=... part of the URL
    //   usePathname()      READ  the /products part of the URL
    //   useRouter()        WRITE navigate to a new URL
    //
    // All three come from "next/navigation".
    // NOT "next/router" — that is the old Pages Router and will not work here.
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // What the URL currently says. `.get()` returns null when ?q= is absent,
    // so `?? ""` turns that into an empty string the <input> can use.
    const currentQuery = searchParams.get("q") ?? "";

    // ── Why local state AND the URL? ─────────────────────────────────────────
    // The input must feel instant — every keystroke shows immediately. But we
    // don't want to touch the URL on every keystroke (see the debounce below).
    //
    // So: `value` is the fast, local copy. The URL catches up 300ms later.
    //
    // Seeding it with `currentQuery` is what makes a shared link work — arrive
    // at /products?q=headphones and the box already says "headphones".
    const [value, setValue] = useState(currentQuery);

    /* ═══════════════════════════════════════════════════════════════════════
       HOW DOES `value` GET INTO THE URL?  — the full chain

       Nothing automatic happens. There is no binding between state and the URL.
       We do it by hand, in five steps. Follow one letter through:

         1. You press "h"
              <input onChange={...}> fires
              → setValue("h")

         2. setValue re-renders the component
              `value` is now "h"

         3. `value` is in this effect's DEPENDENCY ARRAY (bottom of the file),
            so React re-runs the effect. THIS is the link between typing and
            the URL. Without `value` in that array, the effect would never
            re-run and the URL would never change.

         4. The effect starts a 300ms timer. When it fires:
              params.set("q", value)   ← ★ THIS is the moment "h" enters
                                          the query string
              router.replace(newUrl)   ← ★ THIS is what actually navigates

         5. The URL is now /products?q=h
              Next re-renders → useSearchParams() returns the NEW value
              → currentQuery becomes "h"
              → effect runs once more → `value === currentQuery` → returns
                early → the loop stops.

       Step 5 is why the guard on the first line matters. Without it, this
       would loop forever: URL changes → effect runs → URL changes → …
       ═══════════════════════════════════════════════════════════════════════ */
    useEffect(() => {
        // Already in sync? Nothing to do.
        // Two jobs: stops the infinite loop described above (step 5), and stops
        // the effect rewriting the URL on the very first render.
        if (value === currentQuery) return;

        // Start a 300ms timer. If the user types again before it fires, the
        // cleanup below cancels it and a fresh timer starts.
        const timer = setTimeout(() => {
            // ── Build the new query string ───────────────────────────────────
            // URLSearchParams is a built-in browser class for building query
            // strings. You never assemble them with string concatenation —
            // it handles escaping spaces, "&", "?" and so on for you.
            //
            // We COPY the existing params first so anything else already in the
            // URL survives. If the URL is ?page=2&sort=price, this keeps both.
            // Building from scratch would silently delete them.
            const params = new URLSearchParams(searchParams.toString());

            if (value) {
                // ★ THE HANDOFF. This is the line you were asking about.
                // The React state `value` is written into the query string
                // under the key "q". Nothing before this line touched the URL.
                //
                //   value = "headphones"  →  params now holds  q=headphones
                params.set("q", value);
            } else {
                // Empty search → remove the key entirely.
                // Otherwise you'd get a pointless trailing "/products?q="
                params.delete("q");
            }

            // .toString() turns the params object back into a plain string:
            //   URLSearchParams { q: "headphones", page: "2" }
            //     → "q=headphones&page=2"
            //
            // Note: NO leading "?" — we add that ourselves below.
            const queryString = params.toString();

            /* ── The navigation line, piece by piece ──────────────────────────

               router.replace(
                   queryString ? `${pathname}?${queryString}` : pathname,
                   { scroll: false }
               );

               ── Piece 1: the ternary ──
               `queryString ? A : B` means "if queryString has content use A,
               otherwise use B". An empty string "" is falsy in JavaScript.

                 typed "headphones"  →  queryString = "q=headphones"  → truthy
                                     →  use `${pathname}?${queryString}`
                                     →  "/products?q=headphones"

                 cleared the box     →  queryString = ""              → falsy
                                     →  use pathname alone
                                     →  "/products"

               Without the ternary, clearing the box would navigate to
               "/products?" — a stray question mark with nothing after it.

               ── Piece 2: the template literal ──
               `${pathname}?${queryString}` is just string building:

                   pathname     = "/products"        (from usePathname)
                   "?"          = the literal separator we add
                   queryString  = "q=headphones"     (from .toString() above)
                   ─────────────────────────────────
                   result       = "/products?q=headphones"

               We use `pathname` rather than hardcoding "/products" so this
               component works unchanged if you ever render it on another page.

               ── Piece 3: replace, not push ──
                 push    → ADDS a history entry. Type 10 letters, get 10
                           entries, and the Back button is useless.
                 replace → SWAPS the current entry. One Back press leaves.

               ── Piece 4: { scroll: false } ──
               Next scrolls to the top on navigation by default. Since we
               "navigate" on every pause in typing, that would yank the page
               upward while the user is still typing. This turns it off.
               ──────────────────────────────────────────────────────────────── */
            router.replace(
                queryString ? `${pathname}?${queryString}` : pathname,
                { scroll: false }
            );
        }, 300);

        // ── The cleanup function ─────────────────────────────────────────────
        // React runs this before the effect runs again. So each keystroke
        // cancels the pending timer. Only after you STOP typing for 300ms does
        // one finally survive and fire.
        //
        //   h · e · a · d          (four keystrokes, 4 timers started)
        //   ✗   ✗   ✗   ✓          (first three cancelled, last one fires)
        //
        // Without this you'd get one URL update per letter.
        return () => clearTimeout(timer);

        // ── The dependency array ─────────────────────────────────────────────
        // React re-runs this effect whenever any value in here changes.
        //
        //   value        ← ★ THE TRIGGER. Every keystroke changes this, which
        //                    is what makes the effect run again and eventually
        //                    write to the URL. Delete `value` from this array
        //                    and typing stops updating the URL entirely —
        //                    try it once, it's a good way to see what the
        //                    array is actually for.
        //
        //   currentQuery ← needed by the early-return guard above
        //   searchParams ← we read it to copy the existing params
        //   pathname     ← we read it to build the URL
        //   router       ← we call .replace() on it
        //
        // Rule of thumb: everything the effect READS from outside itself goes
        // in here. Leaving something out gives you a stale value from an old
        // render — a bug that's very hard to spot because nothing errors.
    }, [value, currentQuery, searchParams, pathname, router]);

    return (
        <div>
            <label htmlFor="product-search">Search products</label>{" "}
            <input
                id="product-search"
                type="search"
                placeholder="Search…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

            {currentQuery && (
                <p>
                    <small>
                        URL says: <code>?q={currentQuery}</code>
                    </small>
                </p>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THINGS TO ACTUALLY TRY

   1. Type slowly and watch the address bar. It updates once, ~300ms after you
      stop — not once per letter.

   2. Reload the page. The box still holds your search. useState alone could
      never do that.

   3. Press Back once. You leave the page. Now change `router.replace` to
      `router.push`, type "headphones", and try Back again — you'll press it
      ten times to escape. Change it back.

   4. Copy the URL into a new tab. Same search, already applied.

   ───────────────────────────────────────────────────────────────────────────
   THE SUSPENSE RULE

   useSearchParams() forces the component into client-side rendering, because
   the server has no idea what ?q= will be when it pre-renders the page.

   Next.js requires a <Suspense> boundary around any component that calls it.
   Without one, `npm run build` FAILS with:

     "useSearchParams() should be wrapped in a suspense boundary"

   The boundary lets Next pre-render the rest of the page as static HTML and
   fill this one hole in on the client. See products/page.tsx.

   Try deleting the <Suspense> there and running `npm run build` once. Reading
   that error yourself is worth more than this paragraph.
   ═══════════════════════════════════════════════════════════════════════════ */
