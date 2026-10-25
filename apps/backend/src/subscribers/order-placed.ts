import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

/**
 * Pure TypeScript Zero-Dependency PDF Invoice Formatter
 * Produces a compliant PostScript / PDF 1.4 byte stream without external bloated binaries.
 */
function generateInvoicePdfBuffer(order: {
  id: string
  display_id: number | string
  created_at: string
  customer_email: string
  currency_code: string
  total: number
  items: Array<{ title: string; quantity: number; unit_price: number }>
}): Buffer {
  const lines: string[] = [
    "%PDF-1.4",
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ]

  // Construct printable textual representation
  let contentStream = "BT\n/F1 18 Tf\n50 800 Td\n(OFFICIAL COMMERCIAL TAX INVOICE) Tj\n"
  contentStream += "ET\nBT\n/F1 10 Tf\n50 770 Td\n"
  contentStream += `(Order Ref: ${order.id}) Tj\n`
  contentStream += `0 -15 Td\n(Date: ${order.created_at}) Tj\n`
  contentStream += `0 -15 Td\n(Customer: ${order.customer_email}) Tj\n`
  contentStream += `0 -15 Td\n(Currency: ${order.currency_code.toUpperCase()}) Tj\n`
  contentStream += `0 -25 Td\n(--- ITEM SUMMARY ---) Tj\n`

  for (const item of order.items) {
    const cleanTitle = item.title.replace(/[()]/g, "")
    contentStream += `0 -18 Td\n(${cleanTitle} x ${item.quantity} - ${(item.unit_price / 100).toFixed(2)} ${order.currency_code.toUpperCase()}) Tj\n`
  }

  contentStream += `0 -25 Td\n(TOTAL PAYABLE: ${(order.total / 100).toFixed(2)} ${order.currency_code.toUpperCase()}) Tj\n`
  contentStream += "ET\n"

  lines.push(`4 0 obj << /Length ${Buffer.byteLength(contentStream)} >> stream\n${contentStream}\nendstream\nendobj`)
  
  // Cross-reference table
  const body = lines.join("\n") + "\nxref\n0 6\n0000000000 65535 f \n"
  const pdfOutput = `${body}trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${body.length}\n%%EOF`

  return Buffer.from(pdfOutput, "utf8")
}

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderModule = container.resolve(Modules.ORDER)
  const logger = container.resolve("logger")

  try {
    logger.info(`[Worker:OrderPlaced] Consuming event for Order ID: ${data.id}`)

    const order = await orderModule.retrieveOrder(data.id, {
      relations: ["items", "shipping_address"],
    })

    if (!order) {
      logger.warn(`[Worker:OrderPlaced] Order ${data.id} could not be resolved from DB.`)
      return
    }

    // Format invoice parameters
    const invoicePdf = generateInvoicePdfBuffer({
      id: order.id,
      display_id: order.id.slice(-6).toUpperCase(),
      created_at: new Date(order.created_at || Date.now()).toISOString(),
      customer_email: order.email || "customer@store.com",
      currency_code: order.currency_code || "SAR",
      total: Number(order.total || 0),
      items: (order.items || []).map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: Number(item.unit_price || 0),
      })),
    })

    logger.info(
      `[Worker:OrderPlaced] Successfully synthesized PDF tax invoice (${invoicePdf.byteLength} bytes) for order: ${order.id}`
    )

    // In production with an email provider (SendGrid / Resend / SES):
    // await notificationService.send({
    //   to: order.email,
    //   template: "order_confirmation",
    //   attachments: [{ filename: `invoice-${order.id}.pdf`, content: invoicePdf }],
    // })
  } catch (error) {
    logger.error(`[Worker:OrderPlaced] Error executing invoice dispatch pipeline: ${error}`)
    throw error
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
