import { CategoryName } from "@/store/booking";

export interface Category {
  _id: string;
  name: CategoryName;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CategoryApiResponse {
  status: boolean;
  message: string;
  data: Category[];
}
