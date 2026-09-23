"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
    label,
    pendingLabel,
}: {
    label: string;
    pendingLabel: string;
}) {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending}>
            {pending ? pendingLabel : label}
        </button>
    );
}
