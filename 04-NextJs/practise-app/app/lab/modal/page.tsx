import ModalDemo from "./_components/ModalDemo";
import ProductDetails from "./_components/ProductDetails";

export default function ModalLabPage() {
    return (
        <div>
            <h2>Modal — server content inside a client component</h2>
            <p>
                Open the modal, then press Escape, then click the dark backdrop,
                then click the text inside the panel.
            </p>

            {/* ═══════════════════════════════════════════════════════════════
                ★ THE WHOLE POINT OF PROBLEM 3, STEP 8

                <ModalDemo> is a CLIENT component.
                <ProductDetails> is an async SERVER component that reads the DB.

                And the server one is rendered inside the client one.

                ── Why this is allowed ──
                ModalDemo never imports ProductDetails. Look at its file — the
                import isn't there. It only declares `children: ReactNode`, a
                hole.

                THIS page — a Server Component — does the composing. It renders
                ProductDetails on the server first, and passes the finished
                OUTPUT down. ModalDemo receives a rendered result, not code.

                ── The rule, precisely ──
                  ❌ A Client Component cannot IMPORT a Server Component
                       → that would need the server code in the browser bundle
                  ✅ A Client Component CAN RENDER one passed as children
                       → it only receives the output, which is plain data

                "Import" vs "render" is the exact distinction, and it's a
                common interview question.

                ── Proof ──
                ProductDetails logs to your TERMINAL, not the browser console.
                It ran on the server. It is async and touches lib/db.ts —
                neither is possible in a Client Component.
               ═══════════════════════════════════════════════════════════════ */}
            <ModalDemo>
                <ProductDetails id="p-1" />
            </ModalDemo>
        </div>
    );
}
