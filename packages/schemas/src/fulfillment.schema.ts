import { z } from "zod"

export const FulfillmentStatusEnum = z.enum([
  "pending",
  "processing",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "returned",
  "failed",
])

export const TrackingEventSchema = z.object({
  status: FulfillmentStatusEnum,
  timestamp: z.string().datetime(),
  location: z.string().trim().max(255),
  description: z.string().trim().max(500),
})

export const CreateFulfillmentTrackingSchema = z
  .object({
    order_id: z.string().min(1, "order_id is required"),
    tracking_number: z.string().min(3, "tracking_number must have at least 3 characters").max(100),
    carrier: z.string().min(2, "carrier name is required").max(100),
    status: FulfillmentStatusEnum.default("pending"),
    estimated_delivery_date: z.string().datetime().nullable().optional(),
    tracking_events: z.array(TrackingEventSchema).optional().default([]),
  })
  .strict()

export const UpdateFulfillmentTrackingSchema = z
  .object({
    tracking_id: z.string().min(1, "tracking_id is required"),
    status: FulfillmentStatusEnum.optional(),
    estimated_delivery_date: z.string().datetime().nullable().optional(),
    new_event: TrackingEventSchema.optional(),
  })
  .strict()

export type FulfillmentStatus = z.infer<typeof FulfillmentStatusEnum>
export type TrackingEvent = z.infer<typeof TrackingEventSchema>
export type CreateFulfillmentTrackingInput = z.infer<typeof CreateFulfillmentTrackingSchema>
export type UpdateFulfillmentTrackingInput = z.infer<typeof UpdateFulfillmentTrackingSchema>
