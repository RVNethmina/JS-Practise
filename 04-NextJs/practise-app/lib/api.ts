import { NextResponse } from "next/server";

// One error shape for every endpoint in Phase 8. Pick it once here so eight
// handlers can't each invent their own, and a client only has to parse one thing.
export type ApiError = { error: string };

// 1. Wraps NextResponse.json so no handler writes the shape by hand.
// 2. The <ApiError> generic checks the body at compile time — pass the wrong
//    shape and it won't build.
export function apiError(message: string, status: number) {
  return NextResponse.json<ApiError>({ error: message }, { status });
}
