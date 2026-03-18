import { notFound } from "next/navigation"

import { DiagnosticsPanel } from "@/components/admin/diagnostics-panel"

export default function DiagnosticsPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound()
  }

  return <DiagnosticsPanel />
}
