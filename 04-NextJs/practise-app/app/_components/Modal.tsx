/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 4, PROBLEM 3 — Modal

   Two things this teaches:

     1. useEffect CLEANUP — how to add a browser event listener and remove it
        again. Get this wrong and you leak listeners.

     2. The `children` HOLE — this is a Client Component, but the content
        inside it is rendered on the SERVER. A Client Component cannot IMPORT
        a Server Component, but it CAN render one passed as children.
        See app/lab/modal/page.tsx for the other half of that.
   ═══════════════════════════════════════════════════════════════════════════ */

"use client";

import { useEffect } from "react";

type ModalProps = {
    isOpen: boolean;
    /** Called when the user asks to close: Escape, backdrop, or the button. */
    onClose: () => void;
    title: string;
    /**
     * Anything React can render. Typed ReactNode, NOT JSX.Element —
     * ReactNode also allows strings, numbers, arrays and null, all of which
     * are perfectly valid children.
     */
    children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    // ── The Escape key listener ──────────────────────────────────────────────
    useEffect(() => {
        // Modal is closed? Don't attach anything. Nothing to listen for.
        //
        // Note this early return is INSIDE the effect, not above it. Hooks must
        // run in the same order on every render — you can never put a `return`
        // above a hook. (The `if (!isOpen) return null` further down is fine
        // because every hook has already run by then.)
        if (!isOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        // `document` only exists in the browser. This is safe here because
        // useEffect NEVER runs on the server — that's the whole reason the
        // listener goes in an effect rather than in the component body.
        document.addEventListener("keydown", handleKeyDown);

        // ── THE CLEANUP FUNCTION — do not skip this ──────────────────────────
        // React calls this before the effect runs again, and when the component
        // unmounts.
        //
        // Without it:
        //   open the modal    → 1 listener
        //   close and reopen  → 2 listeners
        //   again             → 3 listeners  … and they are NEVER removed
        //
        // That's a memory leak, and Escape starts firing onClose() several
        // times per press. The component is gone but its listener lives on.
        //
        // The function reference passed to removeEventListener must be the
        // SAME one passed to addEventListener. That's why handleKeyDown is a
        // named function and not an inline arrow — an inline arrow would be a
        // brand new function object and would remove nothing.
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Closed → render nothing at all.
    // Returning null is a normal, valid thing for a component to do.
    if (!isOpen) return null;

    return (
        // ── The backdrop ─────────────────────────────────────────────────────
        // The dark sheet behind the dialog. Clicking it closes the modal.
        <div className="modal-backdrop" onClick={onClose} role="presentation">
            {/* ── The panel ────────────────────────────────────────────────────
                onClick with stopPropagation is the important bit.

                WHY: clicks BUBBLE. A click on this panel travels up the DOM to
                the backdrop, whose onClick would fire and close the modal. So
                without this line, clicking anywhere INSIDE the dialog — even
                on the text you're trying to read — closes it.

                stopPropagation() halts that upward journey at this element.

                Try deleting this line and clicking the title. It closes.
               ──────────────────────────────────────────────────────────────── */}
            <div
                className="modal-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="modal-title">{title}</h2>

                {/* ★ THE HOLE.
                    Whatever gets passed in renders here. This component has no
                    idea what it is and never imports it — it just leaves a gap.
                    In the lab page, what lands here was rendered on the server. */}
                {children}

                <button type="button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THREE WAYS TO CLOSE — and why each one exists

     Escape key      keyboard users, and it's the expected convention
     backdrop click  mouse users' instinct is to click away
     Close button    touch users, who have neither of the above

   A dialog with only a Close button is usable. One with all three feels right.

   ───────────────────────────────────────────────────────────────────────────
   THINGS TO TRY

   1. Delete the cleanup `return`. Open and close the modal five times, then
      press Escape and count how many times onClose fires.

   2. Delete the stopPropagation line. Click the title text — it closes.

   3. Change `handleKeyDown` to an inline arrow in BOTH add and remove:
        document.addEventListener("keydown", (e) => { ... });
        return () => document.removeEventListener("keydown", (e) => { ... });
      The remove silently does nothing, because those are two different
      function objects. No error — just a leak. This is why the named
      function matters.

   ───────────────────────────────────────────────────────────────────────────
   NOT DONE HERE (deliberately)

   A production modal also needs focus trapping, focus restore on close, and
   scroll locking on <body>. The native <dialog> element gives you all of that
   for free. This version is hand-rolled because the point is the useEffect
   cleanup and the children boundary, not building the perfect dialog.
   ═══════════════════════════════════════════════════════════════════════════ */
