/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 4, PROBLEM 6 — Theme toggle that survives a reload

   THE THING THAT MAKES THIS HARD

   Your component runs TWICE:

     1st time: on the SERVER, to build the HTML that gets sent to the browser
     2nd time: in the BROWSER, to make it interactive ("hydration")

   React compares the two. If they don't match, you get a hydration error.

   And here's the trap: localStorage only exists in the BROWSER. The server
   has no idea what theme you picked. So if you read localStorage while
   drawing, the two runs disagree and React complains.

   THE FIX
   Draw the same neutral thing both times. Then, once we're safely in the
   browser, read localStorage and switch. That's what `mounted` is for.
   ═══════════════════════════════════════════════════════════════════════════ */

"use client";

import { useEffect, useState } from "react";

// Only two values are allowed. Writing this as a type means a typo like
// "darkk" won't compile.
type Theme = "light" | "dark";

export default function ThemeToggle() {
    // Start with a fixed value. NOT localStorage — the server can't read that.
    // Both runs start at "light", so both runs match. That's the point.
    const [theme, setTheme] = useState<Theme>("light");

    // "Are we in the browser yet?"
    // false on the server, false on the browser's first draw, then true.
    const [mounted, setMounted] = useState(false);

    // ── Effect 1: runs ONCE, right after the first browser draw ─────────────
    // The empty [] at the bottom means "only do this one time".
    //
    // useEffect NEVER runs on the server. So by the time this code runs we're
    // definitely in the browser, and localStorage definitely exists.
    useEffect(() => {
        const saved = localStorage.getItem("theme");

        // getItem returns string | null — it could be anything, or nothing.
        // Check it's one of our two values before trusting it.
        if (saved === "light" || saved === "dark") {
            setTheme(saved);
        }

        // THIS LINE WAS MISSING in your version. Without it `mounted` stays
        // false forever, so the real button never appears.
        setMounted(true);
    }, []);

    // ── Effect 2: runs whenever `theme` changes ─────────────────────────────
    // Separate from Effect 1 on purpose. Effect 1 READS, Effect 2 WRITES.
    // Doing both in one effect is what made your version tangle up.
    useEffect(() => {
        // Don't save until we've finished loading. Without this guard, the
        // very first run would write "light" over the "dark" you'd saved
        // earlier — wiping your choice before Effect 1 could read it.
        if (!mounted) return;

        // setItem needs TWO things: a name and a value.
        // Yours had localStorage.setItem(theme) — that's the value with no name.
        localStorage.setItem("theme", theme);

        // Actually change how the page looks. This puts data-theme="dark" on
        // the <html> tag, and globals.css restyles everything from there.
        document.documentElement.dataset.theme = theme;
    }, [theme, mounted]);

    // ── The neutral placeholder ─────────────────────────────────────────────
    // Before we know the real theme, show something harmless.
    //
    // The server renders this. The browser's first draw renders this too.
    // Identical → React is happy → no error.
    //
    // Your version checked `theme == null`, but theme starts as "light" and is
    // never null, so that check never fired. The right question is
    // "have we mounted yet?"
    if (!mounted) {
        return <button disabled>Theme…</button>;
    }

    // From here on we're safely in the browser and know the real theme.
    return (
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "🌙 Switch to dark" : "☀️ Switch to light"}
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WHY TWO SEPARATE EFFECTS?

   Yours had one effect that read localStorage, wrote localStorage, and called
   setTheme — with [theme] as the dependency. So it changed the very thing it
   was watching. Confusing to follow and easy to get into a loop.

   Split by job and it's obvious:

     Effect 1   []              runs once     READS the saved theme
     Effect 2   [theme, mounted] runs on change  WRITES it and applies it

   ───────────────────────────────────────────────────────────────────────────
   WHAT `mounted` ACTUALLY DOES

     server render      mounted = false   →  shows "Theme…"
     browser 1st draw   mounted = false   →  shows "Theme…"    ← SAME. no error.
     effect runs        mounted = true    →  shows the real button

   React only compares the first browser draw against the server's HTML.
   As long as those two match, you're fine. Everything after is free.

   ───────────────────────────────────────────────────────────────────────────
   TO SEE THE ERROR THIS AVOIDS

   Open app/lab/hydration/_components/BrokenThemeToggle.tsx and follow the
   instructions at the top of that file.

   Actually do it. The error message is one you'll meet again and again, and
   recognising it instantly is worth five minutes now.
   ═══════════════════════════════════════════════════════════════════════════ */
