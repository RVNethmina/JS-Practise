import { apiError } from "@/lib/api";
import { getProducts } from "@/lib/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest
) {

    const q = request.nextUrl.searchParams.get("q");

    if(!q){
        return apiError("Query parameter 'q' is required", 400);
    }

    const limitRaw = Number(request.nextUrl.searchParams.get("limit") ?? 10 );
    const limit = Number.isInteger(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, 50)
        : 10;
    
    const results = await getProducts({ search: q, pageSize: limit});
    
    return NextResponse.json(results, {status : 200 })
}