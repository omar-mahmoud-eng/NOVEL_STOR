import { z } from "zod"

/**
 * Strict Zero Price Manipulation Cart Item Schema
 * The client is strictly forbidden from supplying unit prices, subtotals, or discount rates.
 * Only variant_id and positive integer quantity are admitted into the pipeline.
 */
export const AddToCartSchema = z
  .object({
    variant_id: z
      .string({ required_error: "variant_id is required" })
      .min(1, "variant_id cannot be empty")
      .regex(/^variant_[a-zA-Z0-9]+$/, "Invalid Medusa variant identifier format"),
    quantity: z
      .number({ required_error: "quantity is required" })
      .int("quantity must be an integer")
      .positive("quantity must be strictly greater than 0")
      .max(100, "Maximum permissible single-item purchase limit is 100 units"),
    metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  })
  .strict()

export const UpdateCartLineItemSchema = z
  .object({
    line_item_id: z
      .string({ required_error: "line_item_id is required" })
      .min(1, "line_item_id cannot be empty"),
    quantity: z
      .number({ required_error: "quantity is required" })
      .int("quantity must be an integer")
      .min(0, "quantity cannot be negative")
      .max(100, "Maximum permissible single-item purchase limit is 100 units"),
  })
  .strict()

export type AddToCartInput = z.infer<typeof AddToCartSchema>
export type UpdateCartLineItemInput = z.infer<typeof UpdateCartLineItemSchema>
