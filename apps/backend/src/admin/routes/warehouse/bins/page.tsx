import {adminFetch} from "../../../lib/admin-fetch"
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table } from "@medusajs/ui"
import { Layers, Package, MapPin, CheckCircle2, ArrowRight } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const warehouseTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/warehouse" },
  { label: "مواقع الأرفف والخانَات (Bins & Racks)", href: "/app/warehouse/bins", active: true },
  { label: "حركات المخزون والتدقيق (Stock Audit)", href: "/app/warehouse/movements" },
]

const WarehouseBinsPage = () => {
  const [bins, setBins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState("all")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminFetch("/admin/warehouse")
      if (res.ok) {
        const data = await res.json()
        setBins(data.bins || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredBins = selectedZone === "all" ? bins : bins.filter((b) => b.location_name?.includes(selectedZone))

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Warehouse & WMS"
        currentTitle="Bin & Rack Locations Grid"
        description="خريطة مواقع التخزين، الممرات (Aisle)، الأرفف (Rack)، والخانَات (Bin) مع نسب الامتلاء"
        icon={Layers}
        tabs={warehouseTabs}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* Warehouse Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-ui-fg-base">المستودع:</span>
        <button
          onClick={() => setSelectedZone("all")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            selectedZone === "all"
              ? "bg-ui-bg-interactive text-white"
              : "bg-ui-bg-subtle text-ui-fg-subtle hover:text-ui-fg-base"
          }`}
        >
          جميع المستودعات ({bins.length})
        </button>
        <button
          onClick={() => setSelectedZone("الرياض")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            selectedZone === "الرياض"
              ? "bg-ui-bg-interactive text-white"
              : "bg-ui-bg-subtle text-ui-fg-subtle hover:text-ui-fg-base"
          }`}
        >
          مستودع الرياض (RUH-01)
        </button>
        <button
          onClick={() => setSelectedZone("دبي")}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            selectedZone === "دبي"
              ? "bg-ui-bg-interactive text-white"
              : "bg-ui-bg-subtle text-ui-fg-subtle hover:text-ui-fg-base"
          }`}
        >
          مستودع دبي (DXB-02)
        </button>
      </div>

      {/* Bins Table */}
      <Container className="p-0 overflow-hidden">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              مخطط خانات التخزين الفيزيائي ({filteredBins.length})
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              ربط مباشر بين كل باركود خانة تخزين (Bin Code) والـ SKU المخزن فيها
            </Text>
          </div>
          <Badge color="orange">Physical Layout</Badge>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>كود الخانة (Bin Code)</Table.HeaderCell>
              <Table.HeaderCell>المستودع والموقع</Table.HeaderCell>
              <Table.HeaderCell>الممر / الرف (Aisle / Shelf)</Table.HeaderCell>
              <Table.HeaderCell>الرواية المخزنة (SKU)</Table.HeaderCell>
              <Table.HeaderCell>الكمية الحالية / السعة</Table.HeaderCell>
              <Table.HeaderCell>نسبة الامتلاء</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredBins.map((bin) => {
              const cap = Number(bin.capacity || 100)
              const qty = Number(bin.current_quantity || 0)
              const pct = Math.min(100, Math.round((qty / cap) * 100))
              return (
                <Table.Row key={bin.id}>
                  <Table.Cell>
                    <span className="font-mono text-xs font-bold bg-orange-50 border border-orange-200 text-orange-800 px-2 py-0.5 rounded">
                      {bin.bin_code}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="font-semibold text-xs text-ui-fg-base">{bin.location_name}</div>
                    <div className="text-[11px] text-ui-fg-subtle">منطقة {bin.zone || "A"}</div>
                  </Table.Cell>
                  <Table.Cell className="text-xs font-mono">
                    Aisle: {bin.aisle || "01"} | Shelf: {bin.shelf || "02"}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="font-mono text-xs font-bold text-ui-fg-base">{bin.sku || "UNASSIGNED"}</div>
                  </Table.Cell>
                  <Table.Cell className="text-xs font-semibold">
                    <span className="text-ui-fg-base">{qty}</span> /{" "}
                    <span className="text-ui-fg-muted">{cap} وحدة</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-ui-bg-subtle rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pct > 90 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-ui-fg-subtle">{pct}%</span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Bins & Racks",
})

export default WarehouseBinsPage
