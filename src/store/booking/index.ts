import { Room } from "@/types/rooms";
import { Service } from "@/types/service";
import { create } from "zustand";

export type CategoryName = "Hourly" | "Packages";

export type TimeSlot = {
  start: string;
  end: string;
};

export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequirements: string;
  numberOfPeople: number;
};

interface BookingState {
  currentStep: "category" | "rooms" | "services" | "time" | "confirm";
  selectedCategoryName: CategoryName | null;
  categoryId: string | null; // <-- Add this line

  room: Room | null;
  service: Service | null;
  selectedDate: Date | null;
  selectedTimeSlot: TimeSlot[] | null;
  userInfo: UserInfo;

  // Actions
  setStep: (step: BookingState["currentStep"]) => void;
  selectCategory: (category: CategoryName, categoryId: string) => void;
  setRoom: (room: Room) => void;
  setService: (service: Service) => void;
  selectDate: (date: Date | null) => void;
  selectTimeSlot: (timeSlot: TimeSlot) => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  incrementPeople: () => void;
  decrementPeople: () => void;
  resetSelection: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentStep: "category",
  selectedCategoryName: null,
  categoryId: null, // <-- Initialize here

  room: null,
  service: null,
  selectedDate: null,
  selectedTimeSlot: null,
  userInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequirements: "",
    numberOfPeople: 1,
  },

  setStep: (step) => set({ currentStep: step }),
  selectCategory: (category: CategoryName, categoryId: string) =>
    set({
      selectedCategoryName: category,
      categoryId,
      currentStep: "rooms",
    }),
  setRoom: (room) => set({ room: room, currentStep: "services" }),
  setService: (id) => set({ service: id, currentStep: "time" }),
  selectDate: (date) => set({ selectedDate: date }),
  selectTimeSlot: (timeSlot) =>
    set((state) => {
      if (!state.selectedTimeSlot) return { selectedTimeSlot: [timeSlot] };

      const exists = state.selectedTimeSlot.some(
        (slot) => slot.start === timeSlot.start && slot.end === timeSlot.end
      );

      return {
        selectedTimeSlot: exists
          ? state.selectedTimeSlot.filter(
              (slot) =>
                !(slot.start === timeSlot.start && slot.end === timeSlot.end)
            )
          : [...state.selectedTimeSlot, timeSlot],
      };
    }),
  updateUserInfo: (info) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...info },
    })),
  incrementPeople: () =>
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        numberOfPeople: Math.min(state.userInfo.numberOfPeople + 1, 10),
      },
    })),
  decrementPeople: () =>
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        numberOfPeople: Math.max(state.userInfo.numberOfPeople - 1, 1),
      },
    })),
  resetSelection: () =>
    set({
      selectedCategoryName: null,
      categoryId: null, // <-- Reset it here
      room: null,
      service: null,
      selectedDate: null,
      selectedTimeSlot: null,
      userInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialRequirements: "",
        numberOfPeople: 1,
      },
      currentStep: "category",
    }),
}));
