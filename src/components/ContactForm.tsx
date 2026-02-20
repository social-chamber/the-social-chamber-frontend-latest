"use client";

import type React from "react";

import { useState } from "react";
import { MapPin, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    body: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["contact-us"],
    mutationFn: (values: {
      name: string;
      email: string;
      phoneNumber: string;
      body: string;
      subject:string;
    }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/email/send`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      } else {
        toast?.success(data?.message || "Message received successfully");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <section className="container  mx-auto pt-[40px] md:pt-[70px] lg:pt-[100px]">
      <div className="flex flex-col md:flex-row gap-[23px] rounded-lg overflow-hidden ">
        {/* Left side - Contact Information */}
        <div className="contact__bg py-6 md:py-8 px-4 md:px-6 relative w-full md:max-w-[529px] border border-black/10 rounded-lg overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-poppins leading-[120%] tracking-[0%] font-semibold text-[#FF6900] mb-2 md:mb-[10px]">
              Contact Information
            </h2>
            <p className="text-[#595959] text-base font-poppins leading-[120%] tracking-[0%]">
              Let&apos;s Talk – We&apos;re Here to Help!
            </p>

            <div className="space-y-6 md:space-y-7 lg:space-y-[30px] mt-10 md:mt-16 lg:mt-[120px]">
              {/* <div className="flex items-center gap-5 md:gap-[25px]">
                <PhoneCall className="w-6 h-6" />
                <span className="text-sm font-normal font-poppins leading-[120%] tracking-[0%] text-black">
                  +1 (888) 000-0000
                </span>
              </div> */}

              <div className="flex items-center gap-5 md:gap-[25px]">
                <Mail className="w-6 h-6" />
                <span className="text-sm font-normal font-poppins leading-[120%] tracking-[0%] text-black">
                  thesocialchambersg@gmail.com
                </span>
              </div>

              <div className="flex items-start gap-5 md:gap-[25px]">
                <MapPin className="w-6 h-6" />
                <span className="text-sm font-normal font-poppins leading-[120%] tracking-[0%] text-black">
                11 Mosque St, #02-01, Singapore 
                  <br />
                 059491
                </span>
              </div>
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute bottom-0 -right-14 w-64 h-64 bg-[#FFDEC7]/80 rounded-full opacity-50 -mr-20 -mb-20"></div>
        </div>

        {/* Right side - Contact Form */}
        <div className="w-full md:w-[500px] lg:w-[732px] bg-white p-5 border border-black/10 rounded-lg ">
          <form onSubmit={handleSubmit} className="space-y-[15px]">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="h-[46px] w-full p-[15px] border border-black/10 text-[#2A2A2A] font-normal text-sm font-poppins leading-[120%] rounded-[8px] placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF6900]"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="h-[46px] w-full p-[15px] border border-black/10 text-[#2A2A2A] font-normal text-sm font-poppins leading-[120%] rounded-[8px] placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF6900]"
                required
              />
            </div>

            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="h-[46px] w-full p-[15px] border border-black/10 text-[#2A2A2A] font-normal text-sm font-poppins leading-[120%] rounded-[8px] placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF6900]"
              />
            </div>

            <div>
              <input
                type="sub"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="h-[46px] w-full p-[15px] border border-black/10 text-[#2A2A2A] font-normal text-sm font-poppins leading-[120%] rounded-[8px] placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF6900]"
              />
            </div>

            <div>
              <textarea
                name="body"
                placeholder="Your Message......"
                value={formData.body}
                onChange={handleChange}
                rows={5}
                className="h-[233px] w-full p-[15px] border border-black/10 text-[#2A2A2A] font-normal text-sm font-poppins leading-[120%] rounded-[8px] placeholder:text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF6900]"
                required
              ></textarea>
            </div>

            <div className="mt-[20px] md:mt-[25px] lg:mt-[30px]">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#FF6900] text-base font-poppins leading-[120%] tracking-[0%] text-white font-medium py-4 px-4 rounded-md transition-colors"
              >
                {isPending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
