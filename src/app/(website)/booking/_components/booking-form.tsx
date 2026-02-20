"use client";

import { Button } from "@/components/ui/button";
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
import { BookingFormData, bookingFormSchema } from "@/schemas/booking";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isSubmitting: boolean;
}

export default function BookingForm({
  onSubmit,
  isSubmitting,
}: BookingFormProps) {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequirements: "",
      numberOfPeople: 1,
      promoCode: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-500">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="User First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-500">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="User Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-500">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="User Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-orange-500">Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="User Phone Number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="specialRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-500">
                Special Requirements
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Details" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfPeople"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-500">
                Number of People
              </FormLabel>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={field.value <= 1}
                  onClick={() => field.onChange(field.value - 1)}
                >
                  -
                </Button>
                <Input
                  type="number"
                  {...field}
                  min={1}
                  className="mx-2 w-16 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => field.onChange(field.value + 1)}
                >
                  +
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="promoCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-orange-500">Promo Code</FormLabel>
              <FormControl>
                <Input placeholder="Use promo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {isSubmitting ? "Processing..." : "Book Now"}
        </Button>
      </form>
    </Form>
  );
}
