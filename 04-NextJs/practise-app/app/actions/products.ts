"use server";

import { FormState } from "@/lib/form";
import { createProduct, deleteProduct } from "@/lib/products";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createProductAction(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    // validate
    const slug = formData.get("slug");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const tags = formData.get("tags");
    const inStock = formData.get("inStock");

    const values = {
        slug: typeof slug === "string" ? slug : "",
        name: typeof name === "string" ? name : "",
        description: typeof description === "string" ? description : "",
        price: typeof price === "string" ? price : "",
        categoryId: typeof categoryId === "string" ? categoryId : "",
        tags: typeof tags === "string" ? tags : "",
        inStock: inStock === "on" ? "on" : "",
    };

    if (typeof slug !== "string" || !slug.trim()) {
        return {
            errors: { slug: ["Please enter a valid slug"] },
            values,
        };
    }

    if (typeof name !== "string" || !name.trim()) {
        return {
            errors: { name: ["Please enter a valid name"] },
            values,
        };
    }

    if (typeof description !== "string" || !description.trim()) {
        return {
            errors: { description: ["Please enter a description"] },
            values,
        };
    }

    const priceNumber = Number(price);
    if (typeof price !== "string" || !price.trim() || Number.isNaN(priceNumber)) {
        return {
            errors: { price: ["Price must be a number, in cents"] },
            values,
        };
    }

    if (typeof categoryId !== "string" || !categoryId.trim()) {
        return {
            errors: { categoryId: ["Please enter a category id"] },
            values,
        };
    }

    // A plain text input can't send an array, so tags arrives as one
    // comma-separated string here and gets split into a real string[].
    const tagList = typeof tags === "string"
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    try {
        await createProduct({
            slug,
            name,
            description,
            price: priceNumber,
            categoryId,
            tags: tagList,
            inStock: inStock === "on",
        });
    } catch (error) {
        return { errors: { form: ["Could not save. Please try again."] } };
    }

    revalidatePath("/products");
    revalidateTag("products", "max");
    revalidatePath("/admin/products");

    redirect("/admin/products");
}


export async function deleteProductAction(id: string): Promise<{ error?: string }> {
    const deleted = await deleteProduct(id);

    if (!deleted) {
        return { error: "Product not found." };
    }

    revalidatePath("/admin/products");

    // Does nothing yet: no fetch is tagged "products". Phase 11 Problem 3 adds the tags.
    revalidateTag("products", "max");

    return {};
}