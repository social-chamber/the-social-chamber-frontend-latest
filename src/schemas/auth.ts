import { z } from "zod";

// Define the form schema with Zod
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

// Infer the type from the schema
export type LoginFormValues = z.infer<typeof loginFormSchema>;

// Define the form schema with Zod
export const resetReqestForm = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

// Infer the type from the schema
export type ResetRequestFormValues = z.infer<typeof resetReqestForm>;

// Define the form schema with Zod
export const forgetPassword = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

export type ForgetPasswordType = z.infer<typeof forgetPassword>;
