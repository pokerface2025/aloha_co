import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authorization = request.headers.get("authorization");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authorization) {
      headers.Authorization = authorization;
    }

    const response = await fetch(`${getBackendApiUrl()}/orders/reg`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
