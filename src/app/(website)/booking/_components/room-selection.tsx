"use client";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import SmartImage from "@/components/ui/smart-image";
import { useBookingStore } from "@/store/booking/index";
import { Room, RoomResponse } from "@/types/rooms";
import { useQuery } from "@tanstack/react-query";

const disabledRooms = ["68296afbfb46dd41e61a601b", "68296ad8fb46dd41e61a6018"];

export default function RoomSelection() {
  const { categoryId, setStep } = useBookingStore();

  const { data, isLoading, isError, error } = useQuery<RoomResponse>({
    queryKey: ["rooms"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/room/get-all-rooms`,
      ).then((res) => res.json()),
    enabled: !!categoryId,
  });

  // Use dynamic images from backend (multer or absolute URLs)

  // Redirect if no category is selected
  if (!categoryId) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium">Please select a category first</p>
        <Button
          onClick={() => setStep("category")}
          className="mt-4 bg-orange-500 hover:bg-orange-600"
        >
          Go to Category Selection
        </Button>
      </div>
    );
  }

  let content;

  if (isLoading) {
    content = (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <SkeletonWrapper key={n} isLoading={isLoading}>
            <RoomCard />
          </SkeletonWrapper>
        ))}
      </div>
    );
  } else if (isError) {
    content = (
      <div className="w-full flex justify-center items-center min-h-[300px] flex-col">
        <h1 className="text-lg font-semibold text-red-500">Error</h1>
        <p className="text-gray-400">
          {error?.message ?? "Something went wrong"}
        </p>
      </div>
    );
  } else if ((data?.data?.length ?? 0) === 0) {
    content = (
      <div className="w-full flex justify-center items-center min-h-[300px]">
        <h1 className="text-gray-400 text-lg">No Rooms Found</h1>
      </div>
    );
  } else {
    content = (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data
          .filter((item) => !disabledRooms.includes(item._id))
          .map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
      </div>
    );
  }

  return <div>{content}</div>;
}

type RoomCardProps = {
  room?: Room;
};

export function RoomCard({ room }: RoomCardProps) {
  const { setRoom } = useBookingStore();

  return (
    <div className="relative overflow-hidden rounded-lg h-64">
      <div className="absolute inset-0">
        <SmartImage
          src={room?.image || "/img/all/1750753400044-hero.jpeg"}
          alt={room?.title ?? ""}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="absolute top-6 left-6">
        <h3 className="text-white text-2xl font-bold">{room?.title}</h3>
      </div>
      <div className="absolute bottom-6 inset-x-6">
        {room && (
          <Button
            onClick={() => setRoom(room)}
            variant="outline"
            className="w-full border border-white/70 bg-transparent text-white hover:bg-white/20 hover:text-white transition-colors"
          >
            Select
          </Button>
        )}
      </div>
    </div>
  );
}
