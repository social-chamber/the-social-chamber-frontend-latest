"use client";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import { cn } from "@/lib/utils";
import { CategoryName, useBookingStore } from "@/store/booking/index";
import { Category, CategoryApiResponse } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import SmartImage from "@/components/ui/smart-image";

export default function CategorySelection() {
  const { data, isLoading, isError, error } = useQuery<CategoryApiResponse>({
    queryKey: ["categories"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category/get-all-categories`
      ).then((res) => res.json()),
  });

  let content;

  if (isLoading) {
    content = (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((n) => (
          <SkeletonWrapper isLoading={isLoading} key={n}>
            <CategoryCard />
          </SkeletonWrapper>
        ))}
      </div>
    );
  } else if (isError) {
    content = (
      <div className="w-full flex justify-center items-center min-h-[400px]  flex-col">
        <h1 className="text-[20px] font-semibold mb-1">Error Happened</h1>
        <p className="text-gray-400">
          {error?.message ?? "Something went wrong"}
        </p>
      </div>
    );
  } else if (data?.data?.length === 0) {
    content = (
      <div className="w-full flex justify-center items-center min-h-[400px]">
        <h1 className="text-[18px] text-gray-400">No Category Found</h1>
      </div>
    );
  } else {
    content = (
      <div className="grid md:grid-cols-2 gap-6">
        {data?.data?.map((n) => <CategoryCard key={n._id} category={n} />)}
      </div>
    );
  }

  return <div className="">{content}</div>;
}

const CategoryCard = ({ category }: { category?: Category }) => {
  const { selectCategory, categoryId } = useBookingStore();

  const isSelected = categoryId === category?._id;
  return (
    <div className="relative overflow-hidden rounded-lg h-80">
      <div className="absolute inset-0">
        <SmartImage
          src={category?.image}
          alt={category?.name ?? ""}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="absolute top-6 left-6">
        <h3 className="text-white text-3xl font-bold">{category?.name}</h3>
      </div>
      <div className="absolute bottom-6 inset-x-6">
        <Button
          onClick={() =>
            selectCategory(
              category?.name as CategoryName,
              category?._id as string
            )
          }
          variant="outline"
          className={cn(
            "w-full border  text-white  hover:text-white ",
            isSelected
              ? "bg-orange-500 "
              : " bg-transparent transition-colors hover:bg-white/20 border-white/70"
          )}
          disabled={isSelected}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </div>
    </div>
  );
};
