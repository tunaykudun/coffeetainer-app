"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"

export default function Page() {
  return (
    <AppShell>
      <Card className="bg-[#0d1426] border-white/10">
        <CardHeader>
          <CardTitle>Geçmiş</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">Geçmiş işlemler ve aktiviteler burada listelenebilir.</p>
        </CardContent>
      </Card>
    </AppShell>
  )
}
