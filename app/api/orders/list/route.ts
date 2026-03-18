import { NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/backend-api";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json({ error: "Authorization header required." }, { status: 401 });
    }

    const response = await fetch(`${getBackendApiUrl()}/orders/list`, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
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
