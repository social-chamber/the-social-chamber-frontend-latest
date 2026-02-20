"use client";

import SocialChamberRoom from "@/components/SocialChamberRoom";
import UpdateCart from "@/components/ui/UpdateCart";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const UpdatesComponent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allblog"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/blogs`
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return res.json();
    },
  });

  // Get updates array safely
  const updates = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="container mx-auto pt-[40px] md:pt-[70px] lg:pt-[100px]">
      <h2 className="font-poppins text-[32px] md:text-[40px] lg:text-[48px] text-[#FF6900] leading-[120%] tracking-[0%] text-center font-semibold pb-[20px] md:pb-[30px] lg:pb-[40px]">
        Updates
      </h2>

      {isLoading && <p className="text-center">Loading updates...</p>}

      {isError && (
        <p className="text-center text-red-500">
          Failed to load updates. Please try again.
        </p>
      )}

      {!isLoading && !isError && updates.length === 0 && (
        <p className="text-center text-gray-500">No updates found.</p>
      )}

      {!isLoading && !isError && updates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {updates.map((update: any) => (
            <UpdateCart key={update._id} update={update} />
          ))}
        </div>
      )}
      <SocialChamberRoom />
    </div>
  );
};

export default UpdatesComponent;
