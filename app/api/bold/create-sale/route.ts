import { NextResponse } from "next/server"

interface CreateSaleBody {
  totalAmount: number | string
  description?: string
  email?: string
  callbackUrl?: string
  imgUrl?: string
  orderReference?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateSaleBody
    const totalAmount = body?.totalAmount
    if (totalAmount === undefined || totalAmount === null || totalAmount === "") {
      return NextResponse.json({ error: "totalAmount required" }, { status: 400 })
    }

    const orderReference = body?.orderReference?.toString().trim() || ""
    const fallbackCallbackUrl = "https://google.com"

    const externalPayload = {
      totalAmount: String(totalAmount),
      description: body?.description || "compra no se",
      email: body?.email || "",
      callbackUrl: body?.callbackUrl || fallbackCallbackUrl,
      imgUrl: body?.imgUrl || "",
    }

    try {
      const externalResponse = await fetch(
        "https://be69-2800-484-1873-9100-640f-33f4-ac20-7a1e.ngrok-free.app/bold/createpayment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(externalPayload),
        }
      )

      if (!externalResponse.ok) {
          const errorBody = await externalResponse.text().catch(() => "")
          console.error(
            "[Bold] external createpayment failed",
            JSON.stringify({
              status: externalResponse.status,
              orderReference,
              errorBody,
            })
          )
        return NextResponse.json(
          { error: "External payment creation failed." },
          { status: 502 }
        )
      }

      const responseText = await externalResponse.text().catch(() => "")
      let externalUrl = ""

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText)
          if (typeof parsed === "string") {
            externalUrl = parsed
          } else if (parsed && typeof parsed === "object") {
            const candidate = (parsed as Record<string, unknown>)
            externalUrl =
              (typeof candidate.url === "string" && candidate.url) ||
              (typeof candidate.link === "string" && candidate.link) ||
              (typeof candidate.checkoutUrl === "string" && candidate.checkoutUrl) ||
              ""
          }
        } catch {
          externalUrl = responseText
        }
      }

      if (!externalUrl) {
        console.error(
          "[Bold] external createpayment missing redirect url",
          JSON.stringify({
            orderReference,
            responseText,
          })
        )
        return NextResponse.json(
          { error: "External payment redirect URL missing." },
          { status: 502 }
        )
      }

      return NextResponse.json({
        checkoutUrl: externalUrl,
      })
    } catch (error) {
      console.error("[Bold] external createpayment error", error)
      return NextResponse.json(
        { error: "External payment creation failed." },
        { status: 502 }
      )
    }

    return NextResponse.json({ error: "Unhandled payment flow." }, { status: 500 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
