"use client";

import SubmitButton from "./SubmitButton";

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
    return (
        <form action={action}>
            <SubmitButton label="Delete" pendingLabel="Deleting…" />
        </form>
    );
}
