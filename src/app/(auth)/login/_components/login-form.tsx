"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema, LoginFormValues } from "@/schemas/auth";
import Cookies from "js-cookie"; // Import js-cookie for cookie retrieval
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Retrieve cookies for email and "Remember Me"
const rememberedEmail = Cookies.get("rememberMeEmail");
const rememberMePassword = Cookies.get("rememberMePassword");
const isRemembered = !!rememberedEmail && !!rememberMePassword;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pending] = useTransition();

  const router = useRouter();
  const loading = isLoading || pending;

  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: rememberedEmail ?? "",
      password: rememberMePassword ?? "",
      rememberMe: isRemembered ?? false,
    },
  });

  // Handle form submission
  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }
      toast.success("Login successful!");
      setIsLoading(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        {/* Email field */}
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                      className="w-full h-[50px] border border-black rounded-[8px] text-base font-normal font-poppins leading-[120%] pl-10  tracking-[0%] text-black placeholder:text-[#999999] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 "
                      startIcon={Mail}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Password field */}
        <div className="mt-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter your Password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="w-full h-[50px] border border-black rounded-[8px] text-base font-normal font-poppins leading-[120%] pl-10  tracking-[0%] text-black placeholder:text-[#999999] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      startIcon={Lock}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 text-gray-400"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between mt-4 mb-8">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-poppins font-normal leading-[120%] tracking-[0%] text-black"
                >
                  Remember me
                </label>
              </div>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-sm font-normal font-poppins leading-[120%] trackin-[0%] text-black"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full h-[52px] bg-[#FF6900] rounded-[8px] py-[15px] px-[69px] text-lg font-semibold font-poppins leading-[120%] tracking-[0%] text-[#F4F4F4]"
          disabled={loading}
        >
          {pending
            ? "Signing In..."
            : isLoading
              ? "Just a second..."
              : "Sign In"}
        </button>
      </form>
    </Form>
  );
}
