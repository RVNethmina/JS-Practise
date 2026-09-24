"use client";

import { LoginAction } from "@/app/actions/auth";
import SubmitButton from "@/app/admin/products/_components/SubmitButton";
import { emptyFormState } from "@/lib/form";
import { useActionState } from "react";

export default function Login() {

    const [state, formAction] = useActionState(
        LoginAction,
        emptyFormState
    );

    return (
        <form action={formAction}>

            <input type="email" name="email" placeholder="Enter your email" defaultValue={state.values?.email} />
            {state.errors?.email && <p>{state.errors.email}</p>}

            <input type="password" name="password" placeholder="Enter your password" />
            {state.errors?.password && <p>{state.errors.password}</p>}

            {state.errors?.form && <p>{state.errors.form}</p>}

            <SubmitButton label="Log in" pendingLabel="Logging in…" />

        </form>
    );
}
