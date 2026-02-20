"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useBookingStore } from "@/store/booking";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useSession } from "next-auth/react";



const bookingSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Required"),
  specialRequirements: z.string().optional(),
  numberOfPeople: z.number().min(1, "At least one person"),
  promoCode: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function ConfirmDetails() {
  const {
    categoryId,
    room,
    service,
    selectedTimeSlot,
    selectedDate,
    setStep,
    selectedCategoryName,
  } = useBookingStore();

  const { mutate: paymentIntent, isPending: isPaymentIntentLoading } =
    useMutation({
      mutationKey: ["payment-intent"],
      mutationFn: (bookingId: string) =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/payment-intent`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              booking: bookingId,
            }),
          }
        ).then((res) => res.json()),
      onSuccess: (data) => {
        if (!data.status) {
          toast.error(data.message);
          return;
        }

        // handle success
         // console.log("Payment Intent Success:", data.data);

        window.location.href = data.data.url;
      },
    });

  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

// bokking 
  // const { isPending, mutate } = useMutation({
  //   mutationKey: ["booking"],
  //   mutationFn: (body: any) =>
  //     fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/booking`, {
  //       method: "POST",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify(body),
  //     }).then((res) => res.json()),
  //   onSuccess: (data) => {
  //     if (!data.status) {
  //       toast.error(data.message);
  //       return;
  //     }
  //     // call with booking id
  //     paymentIntent(data.data._id);
  //   },
  //   onError: (err) => {
  //     toast.error(err.message);
  //   },
  // });


  // manual booking 

const { isPending, mutate } = useMutation({
  mutationKey: ["booking"],
  mutationFn: (body: any) => {
    const headers: HeadersInit = {
      "content-type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/booking`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  // onSuccess callback
  onSuccess: (data) => {
    if (!data.status) {
      toast.error(data.message);
      return;
    }

    form.reset(); // Reset the form after successful booking

    // Conditional logic based on token
    if (!token) {
      paymentIntent(data.data._id); // Guests go to payment
    } else {
      toast.success("Manual booking completed successfully");
      // setStep("success"); // Show success to admin
    }
  },
  onError: (err: any) => {
    toast.error(err.message);
  },
});





  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
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

  // for pirce update show
  const numberOfPeople = form.watch("numberOfPeople"); // live watch
  const totalPrice =
    (service?.pricePerSlot ?? 0) *
    numberOfPeople *
    (selectedTimeSlot?.length ?? 0);

  const roomId = room?._id;
  const mockData = {
    category: { id: "1", name: selectedCategoryName },
    room: { id: "1", name: room?.title },
    service: {
      id: "1",
      name: service?.name,
      price: service?.pricePerSlot ?? 0,
    },
  };

  if (!categoryId || !roomId || !service || !selectedTimeSlot) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium">
          Please complete all previous steps first
        </p>
        <Button
          onClick={() => setStep("category")}
          className="mt-4 bg-orange-500 hover:bg-orange-600"
        >
          Start Booking
        </Button>
      </div>
    );
  }

  const handleSubmit = async (data: BookingFormData) => {
    const payload = {
      user: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      },
      date: format(selectedDate!, "MM-dd-yyyy"),
      timeSlots: selectedTimeSlot,
      service: service._id,
      room: room._id,
      promoCode: data.promoCode,
      numberOfPeople: data.numberOfPeople,
    };

    //  // console.log("Booking Payload:", payload);

    mutate(payload);
  };
   // console.log();



  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Your Information</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-500">
                      First Name
                    </FormLabel>
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
                    <Textarea rows={3} placeholder="Details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormField
                control={form.control}
                name="numberOfPeople"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel className="text-orange-500">
                      Number of People
                    </FormLabel>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={field.value <= 1}
                        onClick={() => field.onChange(field.value - 1)}
                      >
                        -
                      </Button>

                      <Button
                        disabled={true}
                        variant="outline"
                        className="disabled:opacity-100"
                      >
                        {field.value}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={field.value >= 5}
                        onClick={() => field.onChange(field.value + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            {/* Menual Booking */}
              {token ? (
        <div>
          {/* <input className="my-5" type="checkbox" />  */}
       <p className="font-bold text-orange-500 my-2">    Menual Booking ( Only For Admin)</p>
        </div>
      ) : (
        <p></p>
      )}



            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isPending || isPaymentIntentLoading}
            >
              {isPending
                ? "Processing..."
                : isPaymentIntentLoading
                  ? "Generating your payment..."
                  : "Book Now"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-medium text-center mb-6">
          {mockData.service.name}
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {selectedTimeSlot
                ? format(selectedDate!, "MM-dd-yyyy")
                : "Not selected"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{mockData.category.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Room:</span>
            <span className="font-medium">{mockData.room.name}</span>
          </div>

          <div className="border-t pt-4 mt-6 flex justify-between items-center">
            <span className="font-medium">Total for booking:</span>
            <span className="text-xl font-bold">
              {/* ${mockData.service.price.toFixed(2)} */}$
              {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /*
  
  {
    "user": {
        "firstName": "Monir Hossain",
        "lastName": "Rabby",
        "email": "monir.bdcalling@gmail.com",
        "phone": "01956306002"
    },
    "date": "2025-05-21T18:00:00.000Z",
    "timeSlots": [
        {
            "start": "09:00",
            "end": "10:00"
        }
    ],
    "service": "6829bc2a8f11fa6517869230",
    "room": "68296b5cfb46dd41e61a6024",
    "promoCode": "",
    "numberOfPeople": 3
}
  */
}
