import ThemeToggle from "@/app/_components/ThemeToggle";

/* ─────────────────────────────────────────────────────────────────────────────
   TO SEE THE HYDRATION ERROR

   1. First switch to dark below, so "dark" is saved in localStorage.
   2. Then change the two marked lines:

        import ThemeToggle from "@/app/_components/ThemeToggle";
        →  import ThemeToggle from "./_components/BrokenThemeToggle";

      (the component is used as <ThemeToggle /> below, so only the import
       line needs changing)

   3. Reload this page with the console open.
   4. Read the error, then change the import back.

   BrokenThemeToggle.tsx explains what you're looking at.
   ───────────────────────────────────────────────────────────────────────────── */

export default function HydrationPage() {
    return (
        <div>
            <h2>Theme toggle — surviving a reload without a hydration error</h2>

            <p>Try these in order:</p>
            <ol>
                <li>Click the button — the page colours flip</li>
                <li>
                    Press F5. The theme is <strong>still there</strong>, and the
                    console is clean.
                </li>
                <li>
                    Watch closely on reload — the button says
                    &ldquo;Theme…&rdquo; for a split second first. That&apos;s
                    the neutral placeholder doing its job.
                </li>
            </ol>

            <ThemeToggle />

            <p style={{ marginTop: "2rem" }}>
                Step 3 is the whole trick. That flash is the price of not having
                a hydration error — the server draws something safe, then the
                browser corrects it.
            </p>
        </div>
    );
}
