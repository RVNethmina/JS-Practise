"use client";

import { deleteProductAction } from "@/app/actions/products";
import SubmitButton from "./SubmitButton";

export default function DeleteButton({ id }: { id: string }) {
    return (
        <form action={deleteProductAction.bind(null, id)}>
            <SubmitButton label="Delete" pendingLabel="Deleting…" />
        </form>
    );
}
