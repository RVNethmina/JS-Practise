import { getProducts } from "@/lib/products";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest
)
{
    // 1. Read the raw query string values. In a Route Handler this is
    //    synchronous — NextRequest, not the params/searchParams Promise a page gets.
    const pageRaw = Number(request.nextUrl.searchParams.get("page"));
    const pageSizeRaw = Number(request.nextUrl.searchParams.get("pageSize"));

    // 2. NaN, 0, and negative numbers all fall back to a sane default instead
    //    of reaching getProducts with garbage.
    const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const pageSize = Number.isInteger(pageSizeRaw) && pageSizeRaw > 0
        ? Math.min(pageSizeRaw, 50)
        : 10;

    // 3. getProducts already clamps page to the last real page and returns
    //    the full { items, page, pageSize, total, totalPages } shape — pass
    //    it straight through so the client can build pagination controls
    //    without a second request.
    const result = await getProducts({ page, pageSize });

    return NextResponse.json(result, { status: 200 });
}