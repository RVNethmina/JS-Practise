/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 4, PROBLEM 4 — Dropdown

   WHAT WE'RE BUILDING
   A button. Click it, a menu appears. Click anywhere else on the page, the
   menu goes away.

   THE ONLY HARD PART
   That last bit. "Click anywhere else."

   Think about it. Your Dropdown component can only see clicks on its OWN
   buttons — that's what onClick does. If someone clicks a paragraph at the
   bottom of the page, your component hears nothing. It has no idea.

   So we do something new: we ask the WHOLE PAGE to tell us about every click.
   Then for each one we ask "was that click on me, or somewhere else?"

   That's it. That's the whole problem.
   ═══════════════════════════════════════════════════════════════════════════ */

"use client";

import { useEffect, useRef, useState } from "react";

type DropdownItem = {
    id: string;
    label: string;
};

type DropdownProps = {
    label: string;
    items: DropdownItem[];
};

export default function Dropdown({ label, items }: DropdownProps) {
    // Normal useState. You know these.
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // ── useRef — the new thing ───────────────────────────────────────────────
    //
    // A ref is a BOX. Right now it's empty.
    //
    // Look further down: we wrote ref={containerRef} on a <div>. That tells
    // React "when you put that div on the page, drop it in this box".
    //
    // After the page loads, containerRef.current IS that div. The real one.
    // The same thing you'd get from document.getElementById.
    //
    // Why do we want it? Because in a moment we need to ask that div a
    // question: "was this click inside you?" To ask it, we need to be holding
    // it. The box is how we hold it.
    //
    // It starts as null because when the component first runs, the div hasn't
    // been created yet. That's why you'll see `?.` later on.
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Listening to the whole page ──────────────────────────────────────────
    useEffect(() => {
        // Menu is closed? Then there's nothing to close. Stop here.
        if (!isOpen) return;

        // This function will run EVERY time someone clicks ANYWHERE.
        function handleClickAnywhere(event: MouseEvent) {
            // `event.target` = the exact thing that got clicked.
            //
            // TypeScript isn't sure that's a real element on the page, so we
            // check first. If it somehow isn't, just do nothing.
            if (!(event.target instanceof Node)) return;

            // ★ THE IMPORTANT LINE.
            //
            // .contains(x) asks our div: "is x me, or is x inside me?"
            //
            //   clicked our button      → yes, inside  → leave the menu open
            //   clicked a menu item     → yes, inside  → leave the menu open
            //   clicked anything else   → no           → close the menu
            //
            // The `?.` is because the box might still be empty (null).
            if (!containerRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        }

        // Escape key should close it too.
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        // Here's where we actually ask the page to start telling us.
        // "document" means the whole page.
        document.addEventListener("mousedown", handleClickAnywhere);
        document.addEventListener("keydown", handleEscape);

        // ── This return is NOT optional ──────────────────────────────────────
        //
        // We just asked the page to tell us about clicks. We have to remember
        // to say "ok, stop telling me" when we're done.
        //
        // React runs this returned function for us at the right moment.
        //
        // If you skip it:
        //   open the menu           → page is telling us about clicks (1 time)
        //   close it, open it again → page is telling us TWICE
        //   again                   → THREE times
        //
        // Nobody ever cancelled the old ones. They pile up forever and your
        // close code runs over and over for a single click.
        return () => {
            document.removeEventListener("mousedown", handleClickAnywhere);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    // Which item did they pick? (undefined if none yet.)
    const selected = items.find((item) => item.id === selectedId);

    return (
        // ★ ref goes HERE, on the outer div.
        //
        // This div is what "inside" means. The button and the menu are both
        // in here, so clicking either one counts as inside.
        <div className="dropdown" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                // Tells screen readers whether the menu is currently open.
                aria-expanded={isOpen}
            >
                {selected ? selected.label : label} {isOpen ? "▲" : "▼"}
            </button>

            {/* `isOpen && ...` means "only show this when isOpen is true". */}
            {isOpen && (
                <ul className="dropdown-menu">
                    {items.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedId(item.id);
                                    setIsOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   useState vs useRef — when do I use which?

     useState  →  when changing it should update what's on screen
     useRef    →  when you just need to hold onto something

   Changing a ref does NOT redraw the component. That's the main difference.

   Here we hold a div so we can ask it questions. We never show it on screen.
   So: ref.

   (Also, if you tried to keep the div in useState you'd get an infinite loop —
   setting state redraws, redrawing makes a new div, which sets state again.)

   ───────────────────────────────────────────────────────────────────────────
   THREE THINGS TO TRY — each takes 30 seconds

   1. DELETE the `return () => {...}` cleanup part.
      Open and close the menu ten times. Then click outside.
      Your close code now runs ten times for one click.

   2. MOVE ref={containerRef} from the outer <div> onto the <ul>.
      Now the button is "outside". So clicking it opens the menu AND
      immediately closes it. The menu becomes impossible to open.
      → This shows you exactly what the ref's position means.

   3. DELETE "use client" from the top of this file. Load /lab/dropdown.
      Read the error. Notice it happens on the SERVER, not in the browser.
      Server code runs in Node, and Node has no web page — so there's no
      `document` to listen to, and useState/useEffect/useRef don't exist.
      Put it back after.

   ───────────────────────────────────────────────────────────────────────────
   SMALL DETAIL: why "mousedown" and not "click"?

   A "click" only counts once you LET GO of the mouse button.
   "mousedown" happens the instant you PRESS.

   mousedown is a bit safer here and feels faster. If you use "click" today
   you won't notice a difference — just know mousedown is the usual choice.

   ───────────────────────────────────────────────────────────────────────────
   WHAT THIS DROPDOWN DOESN'T DO

   Real ones also let you move through options with the arrow keys, jump by
   typing a letter, and manage where keyboard focus goes. That's a lot of
   extra work and it isn't what this problem is teaching.

   In a real job you'd use a ready-made library for this. Here we're learning
   useRef and the click-outside trick, so we stop once those work.
   ═══════════════════════════════════════════════════════════════════════════ */
