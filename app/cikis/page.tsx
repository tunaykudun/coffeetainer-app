"use client"

import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"

export default function Page() {
  return (
    <AppShell>
      <Card className="bg-[#0d1426] border-white/10">
        <CardHeader>
          <CardTitle>Çıkış</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">Bu sayfayı gerçek oturum kapatma işlemi ile bağlayın.</p>
        </CardContent>
      </Card>
    </AppShell>
  )
}
