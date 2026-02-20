import { z } from "zod";

export const bookingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone number is required"),
  specialRequirements: z.string().optional(),
  numberOfPeople: z.number().min(1),
  promoCode: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
