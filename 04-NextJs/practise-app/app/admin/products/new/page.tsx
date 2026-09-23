"use client";

import { createProductAction } from "@/app/actions/products";
import { emptyFormState } from "@/lib/form";
import { useActionState } from "react";

export default function CreateProduct() {

    const [state, formAction] = useActionState(
        createProductAction,
        emptyFormState
    );

    return (
        <form action={formAction}>
            <input type="text" name="slug" placeholder="Slug" defaultValue={state.values?.slug} />
            {state.errors?.slug && <p>{state.errors.slug}</p>}

            <input type="text" name="name" placeholder="Name" defaultValue={state.values?.name} />
            {state.errors?.name && <p>{state.errors.name}</p>}

            <input type="text" name="description" placeholder="Description" defaultValue={state.values?.description} />
            {state.errors?.description && <p>{state.errors.description}</p>}

            <input type="text" name="price" placeholder="Price in cents" defaultValue={state.values?.price} />
            {state.errors?.price && <p>{state.errors.price}</p>}

            <input type="text" name="categoryId" placeholder="Category id" defaultValue={state.values?.categoryId} />
            {state.errors?.categoryId && <p>{state.errors.categoryId}</p>}

            <input type="text" name="tags" placeholder="Tags, comma separated" defaultValue={state.values?.tags} />

            <label>
                <input type="checkbox" name="inStock" defaultChecked={state.values?.inStock === "on"} />
                In stock
            </label>

            {state.errors?.form && <p>{state.errors.form}</p>}

            <button type="submit">Create</button>
        </form>
    );
}
