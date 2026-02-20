"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

// Define the form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  body: z.string().min(1, { message: "Email body is required" }),
});

type EmailFormValues = z.infer<typeof formSchema>;

interface EmailModalProps {
  recipientEmail?: string;
  trigger: ReactNode;
}

export default function EmailSendingModal({
  recipientEmail,
  trigger,
}: EmailModalProps) {
  const [open, onOpenChange] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: recipientEmail,
      subject: "",
      body: "",
    },
  });
    const { data } = useSession();
  const token = (data?.user as { accessToken: string })?.accessToken;

  const mutation = useMutation({
    mutationFn: async (data: EmailFormValues) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/email/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send email");
      }

      return res.json();
    },
    onSuccess: (success) => {
      toast.success(success.message || "Email sent successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send email");
    },
  });

  const onSubmit = (data: EmailFormValues) => {
    onOpenChange(false);
    mutation.mutate(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-500">
            Send Email
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-orange-200 my-2" />

        <div className="bg-gray-50 p-4 rounded-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[80px_1fr] items-center gap-4">
                    <FormLabel className="text-right">Email:</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        {...field}
                        className="bg-white"
                        placeholder="user@example.com"
                      />
                    </FormControl>
                    <FormMessage className="col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[80px_1fr] items-center gap-4">
                    <FormLabel className="text-right">Subject:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Subject"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage className="col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[80px_1fr] items-start gap-4">
                    <FormLabel className="text-right pt-2">Body:</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Textarea
                          placeholder="Text"
                          className="min-h-[200px] resize-none bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
