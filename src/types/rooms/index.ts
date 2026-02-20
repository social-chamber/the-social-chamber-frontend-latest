import { Category } from "../category";

export type Room = {
  _id: string;
  title: string;
  image: string;
  category: Category;
  maxCapacity: number;
  status: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export interface RoomResponse {
  status: boolean;
  message: string;
  data: Room[];
}
