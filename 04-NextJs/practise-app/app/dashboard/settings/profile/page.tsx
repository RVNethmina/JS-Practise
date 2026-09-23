"use client";
import { updateProfileAction } from "@/app/actions/profile";
import { emptyFormState } from "@/lib/form";
import { useActionState } from "react";

export default function DashboardSettingsProfile() {

    const [state, formAction] = useActionState(
        updateProfileAction,
        emptyFormState
    );

    return (
        <form action={formAction}>
            <input type="text" name="name" placeholder="Enter your name" defaultValue={state.values?.name} />
            {state.errors?.name && <p>{state.errors.name}</p>}
            <input type="email" name="email" placeholder="Enter your email" defaultValue={state.values?.email} />
            {state.errors?.email && <p>{state.errors.email}</p>}

            {state.message && <p>{state.message}</p>}

            <button>
                save
            </button>
        </form>
    )
}