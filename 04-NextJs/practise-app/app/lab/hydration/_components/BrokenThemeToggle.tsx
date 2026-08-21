/* ═══════════════════════════════════════════════════════════════════════════
   THE BROKEN VERSION — for seeing the error on purpose

   HOW TO USE THIS FILE

     1. Go to /lab/hydration with the GOOD toggle and switch to dark.
        (This saves "dark" into localStorage. You need that for step 3.)

     2. Open app/lab/hydration/page.tsx and follow the swap instructions
        in the comment there.

     3. Reload /lab/hydration and open the browser console.

     4. Read the error. Then swap back.

   ───────────────────────────────────────────────────────────────────────────
   THERE ARE TWO DIFFERENT WAYS TO BREAK THIS, and they give DIFFERENT errors.
   Worth knowing both, because people mix them up.

   ── BREAK #1: just read localStorage while drawing ──

       const [theme, setTheme] = useState(localStorage.getItem("theme"));

   This does NOT give you a hydration error. It gives you a CRASH:

       ReferenceError: localStorage is not defined

   Why: this component gets drawn on the server first, and the server has no
   browser. There is no localStorage there at all. The code dies before
   hydration is ever reached.

   ── BREAK #2: guard it, so it survives the server ── ← what's below

       typeof window !== "undefined" ? localStorage.getItem(...) : "light"

   Now it survives the server (returns "light") AND runs in the browser
   (returns "dark"). No crash — but the two drawings disagree, and THAT is a
   real hydration mismatch.

   Break #2 is the sneakier one, and it's what people actually ship by
   accident, because "just add a typeof window check" looks like a fix.
   ═══════════════════════════════════════════════════════════════════════════ */

"use client";

import { useState } from "react";

export default function BrokenThemeToggle() {
    // ★ THE BROKEN LINE
    //
    // On the SERVER : there's no window, so this gives "light"
    // In the BROWSER: window exists, so this gives "dark" (if you saved dark)
    //
    // Two different answers for the same first drawing. React notices.
    const [theme, setTheme] = useState(
        typeof window !== "undefined"
            ? localStorage.getItem("theme") ?? "light"
            : "light"
    );

    return (
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "🌙 Switch to dark" : "☀️ Switch to light"}
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WHAT YOU'LL SEE IN THE CONSOLE

   Something along the lines of:

     Hydration failed because the server rendered text didn't match the client.
     ... a tree of your component with the two different values marked

   React's own summary of the cause is worth remembering: it happens when
   what the server drew and what the browser drew are not the same.

   Common causes, all the same shape — "the server can't know this":

     localStorage / sessionStorage    only exists in the browser
     window / document                only exists in the browser
     new Date() / Date.now()          the two runs happen at different times
     Math.random()                    different number each time

   THE FIX IS ALWAYS THE SAME SHAPE:
   draw something neutral that both runs agree on, then correct it inside
   useEffect — which only ever runs in the browser.

   Write down the error text before you swap back. Recognising it on sight
   saves you a lot of time later.
   ═══════════════════════════════════════════════════════════════════════════ */
