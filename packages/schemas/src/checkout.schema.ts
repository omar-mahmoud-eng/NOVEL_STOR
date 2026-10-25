import { z } from "zod"

/**
 * Address Schema supporting international standards including Arabic (UTF-8 script)
 * and Latin characters without arbitrary truncation.
 */
export const AddressSchema = z
  .object({
    first_name: z
      .string({ required_error: "first_name is required" })
      .trim()
      .min(1, "First name is required")
      .max(64, "First name exceeds maximum allowed length of 64 characters"),
    last_name: z
      .string({ required_error: "last_name is required" })
      .trim()
      .min(1, "Last name is required")
      .max(64, "Last name exceeds maximum allowed length of 64 characters"),
    company: z.string().trim().max(100).optional(),
    address_1: z
      .string({ required_error: "address_1 is required" })
      .trim()
      .min(3, "Street address must be at least 3 characters")
      .max(255, "Address exceeds 255 characters"),
    address_2: z.string().trim().max(255).optional(),
    city: z
      .string({ required_error: "city is required" })
      .trim()
      .min(2, "City name must be at least 2 characters")
      .max(100, "City exceeds 100 characters"),
    country_code: z
      .string({ required_error: "country_code is required" })
      .trim()
      .length(2, "country_code must be a standard 2-letter ISO country code (e.g., SA, AE, US)")
      .transform((val) => val.toLowerCase()),
    province: z.string().trim().max(100).optional(),
    postal_code: z
      .string({ required_error: "postal_code is required" })
      .trim()
      .min(2, "Postal code must be at least 2 characters")
      .max(20, "Postal code exceeds 20 characters"),
    phone: z
      .string({ required_error: "phone is required" })
      .trim()
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Phone number must conform to international E.164 standard (e.g., +966500000000)"
      ),
  })
  .strict()

export const InitializeCheckoutSchema = z
  .object({
    cart_id: z
      .string({ required_error: "cart_id is required" })
      .regex(/^cart_[a-zA-Z0-9]+$/, "Invalid Medusa cart identifier"),
    email: z
      .string({ required_error: "email is required" })
      .trim()
      .email("Must be a valid email address")
      .max(255),
    shipping_address: AddressSchema,
    billing_address: AddressSchema.optional(),
  })
  .strict()

export const CompleteCheckoutSchema = z
  .object({
    cart_id: z
      .string({ required_error: "cart_id is required" })
      .regex(/^cart_[a-zA-Z0-9]+$/, "Invalid Medusa cart identifier"),
    payment_session_id: z
      .string({ required_error: "payment_session_id is required" })
      .min(1, "payment_session_id cannot be empty"),
  })
  .strict()

export type AddressInput = z.infer<typeof AddressSchema>
export type InitializeCheckoutInput = z.infer<typeof InitializeCheckoutSchema>
export type CompleteCheckoutInput = z.infer<typeof CompleteCheckoutSchema>
