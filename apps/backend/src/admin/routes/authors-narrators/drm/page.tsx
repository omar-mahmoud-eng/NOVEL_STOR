import React, { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button, Table, Input } from "@medusajs/ui"
import { ShieldCheck, Key, Lock, CheckCircle2, RefreshCw, Smartphone, Globe, Radio } from "lucide-react"
import { SubNav } from "../../../components/sub-nav"

const authorsTabs = [
  { label: "لوحة التحكم (Dashboard)", href: "/app/authors-narrators" },
  { label: "تراخيص وحماية البث الصوتي (DRM & Tokens)", href: "/app/authors-narrators/drm", active: true },
]

const audioTracks = [
  { id: "trk_01", title: "ثلاثية غرناطة - الفصل الأول", author: "رضوى عاشور", narrator: "عمر الشريف الصوتي", encryption: "AES-128 HLS Encrypted", tokenTTL: "120 min", status: "Protected" },
  { id: "trk_02", title: "أولاد حارتنا - المقطع التمهيدي", author: "نجيب محفوظ", narrator: "فهد العتيبي", encryption: "FairPlay / Widevine DRM", tokenTTL: "240 min", status: "Protected" },
  { id: "trk_03", title: "موت صغير - رحلة ابن عربي", author: "محمد حسن علوان", narrator: "طارق العليان", encryption: "AES-128 HLS Encrypted", tokenTTL: "120 min", status: "Protected" },
  { id: "trk_04", title: "قواعد العشق الأربعون - الجزء الأول", author: "إليف شافاق", narrator: "سارة المنصور", encryption: "FairPlay / Widevine DRM", tokenTTL: "360 min", status: "Protected" },
]

const DrmAudioSecurityPage = () => {
  const [tokenKey, setTokenKey] = useState("sec_hls_live_a89f92d4c09bb179")
  const [watermarkEnabled, setWatermarkEnabled] = useState(true)
  const [feedback, setFeedback] = useState("")

  const handleRotateKey = () => {
    const newKey = `sec_hls_live_${Math.random().toString(36).substring(2, 12)}`
    setTokenKey(newKey)
    setFeedback("تم تدوير مفتاح التشفير HLS وتحديث توكنات البث لجميع المشتركين!")
    setTimeout(() => setFeedback(""), 4000)
  }

  return (
    <div className="space-y-6">
      <SubNav
        parentTitle="Authors & Narrators"
        currentTitle="Audio DRM & Piracy Protection"
        description="حماية البث الصوتي المشفر عبر HLS AES-128، العلامات المائية الصوتية غير المسموعة، وإدارة مفاتيح الاستماع"
        icon={ShieldCheck}
        tabs={authorsTabs}
      />

      {/* Security Status Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Container className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-ui-fg-subtle">تشفير البث المباشر (DRM)</div>
            <div className="text-sm font-bold text-ui-fg-base">HLS AES-128 / Widevine</div>
            <div className="text-[11px] text-emerald-600 font-semibold">100% مسارات محمية</div>
          </div>
        </Container>

        <Container className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-ui-fg-subtle">العلامة المائية المخصصة</div>
            <div className="text-sm font-bold text-ui-fg-base">
              {watermarkEnabled ? "مفعلة برقم العميل" : "معطلة"}
            </div>
            <div className="text-[11px] text-ui-fg-muted">تتبع التسريبات غير القانونية</div>
          </div>
        </Container>

        <Container className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-ui-fg-subtle">مفتاح جلسة التشفير الحالية</div>
            <div className="text-xs font-mono font-bold text-ui-fg-base truncate max-w-[150px]">
              {tokenKey}
            </div>
            <button
              onClick={handleRotateKey}
              className="text-[11px] text-indigo-600 hover:underline font-semibold mt-0.5"
            >
              تدوير المفتاح الآن (Rotate)
            </button>
          </div>
        </Container>
      </div>

      {feedback && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          {feedback}
        </div>
      )}

      {/* Audio Tracks DRM Table */}
      <Container className="p-0 overflow-hidden">
        <div className="p-4 border-b border-ui-border-base flex items-center justify-between">
          <div>
            <Heading level="h2" className="text-base font-bold text-ui-fg-base">
              مسارات الروايات الصوتية المشفرة ({audioTracks.length})
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              قائمة الفصول الصوتية المرفوعة وحالة أمان البث ومفاتيح المصادقة اللحظية
            </Text>
          </div>
          <Badge color="purple">DRM Active</Badge>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>عنوان الرواية والفصل</Table.HeaderCell>
              <Table.HeaderCell>المؤلف والراوي</Table.HeaderCell>
              <Table.HeaderCell>بروتوكول الحماية والتشفير</Table.HeaderCell>
              <Table.HeaderCell>مدة صلاحية التوكن (TTL)</Table.HeaderCell>
              <Table.HeaderCell>حالة الأمان</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {audioTracks.map((trk) => (
              <Table.Row key={trk.id}>
                <Table.Cell className="font-semibold text-sm text-ui-fg-base">
                  {trk.title}
                </Table.Cell>
                <Table.Cell className="text-xs text-ui-fg-subtle">
                  <span>{trk.author}</span> • <span className="font-medium text-ui-fg-base">{trk.narrator}</span>
                </Table.Cell>
                <Table.Cell>
                  <Badge color="blue">{trk.encryption}</Badge>
                </Table.Cell>
                <Table.Cell className="font-mono text-xs text-ui-fg-base">
                  {trk.tokenTTL}
                </Table.Cell>
                <Table.Cell>
                  <Badge color="green">{trk.status}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Audio DRM & Security",
})

export default DrmAudioSecurityPage
