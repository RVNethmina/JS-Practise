/* The Client Component that OWNS the open/closed state.

   It sits between the server page and the Modal. Its only jobs are holding
   `isOpen` and passing `children` straight through untouched. */

"use client";

import { useState } from "react";
import Modal from "@/app/_components/Modal";

type ModalDemoProps = {
    children: React.ReactNode;
};

export default function ModalDemo({ children }: ModalDemoProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)}>
                Open modal
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Aurora Wireless Headphones"
            >
                {/* `children` arrived from the server page above and is handed
                    straight down. This component never inspects it, never
                    imports it, and could not render it itself. */}
                {children}
            </Modal>
        </>
    );
}
