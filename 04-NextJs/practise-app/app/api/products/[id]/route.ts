import { apiError } from "@/lib/api";
import { deleteProduct, getProduct, updateProduct } from "@/lib/products";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params } : { params : Promise<{ id: string }> }
){

    const { id } = await params;

    const product = await getProduct(id);

    if(!product){
        return apiError("Product not Found!", 404)
    }

    return NextResponse.json(product, { status: 200 });
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return apiError("Invalid JSON body", 400);
    }

    // 2. PUT means "here is the full resource" — every one of these is required.
    if (typeof body.name !== "string" || body.name.trim() === "") {
        return apiError("name must be a non-empty string", 400);
    }
    if (typeof body.description !== "string" || body.description.trim() === "") {
        return apiError("description must be a non-empty string", 400);
    }
    if (typeof body.price !== "number") {
        return apiError("price must be a number", 400);
    }
    if (typeof body.categoryId !== "string" || body.categoryId.trim() === "") {
        return apiError("categoryId must be a non-empty string", 400);
    }
    if (typeof body.inStock !== "boolean") {
        return apiError("inStock must be a boolean", 400);
    }

    // 3. All required fields checked out. Save the replacement.
    const product = await updateProduct(id, {
        name: body.name,
        description: body.description,
        price: body.price,
        categoryId: body.categoryId,
        inStock: body.inStock,
    });

    // 4. updateProduct returns null when the id doesn't exist.
    if (!product) {
        return apiError("Product not Found!", 404);
    }

    return NextResponse.json(product, { status: 200 });
}

const PATCHABLE_KEYS = [
    "name",
    "description",
    "price",
    "categoryId",
    "tags",
    "inStock",
    "variants",
];


export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return apiError("Invalid JSON body", 400);
    }

    const unknownKey = Object.keys(body).find(
        (key) => !PATCHABLE_KEYS.includes(key)
    );
    if (unknownKey) {
        return apiError(`Unknown field: ${unknownKey}`, 400);
    }

    const product = await updateProduct(id, body);

    // 4. Same 404 rule as PUT.
    if (!product) {
        return apiError("Product not Found!", 404);
    }

    return NextResponse.json(product, { status: 200 });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    const deleted = await deleteProduct(id);

    if (!deleted) {
        return apiError("Product not Found!", 404);
    }

    // 204 means "No Content" — the body must be genuinely empty.
    // NextResponse.json(null, { status: 204 }) still writes the string
    // "null" as a body, which contradicts the status. new Response(null, ...)
    // is the version that actually sends nothing.
    return new Response(null, { status: 204 });
}