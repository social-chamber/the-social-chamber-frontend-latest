import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type logoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal = ({ isOpen, onClose, onConfirm }: logoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
          <DialogDescription>
            You are about to log out of your account. You will need to log in
            again to continue using the services.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex items-center justify-end gap-7 mt-5">
          <button
            className="text-white bg-[#FF6900] py-[8px] px-6 text-sm font-medium leading-[120%] rounded-[8px]"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="text-base font-medium bg-green-600 text-white leading-[120%] py-[8px] px-[18px] rounded-lg shadow-none border-none"
            onClick={onClose}
          >
            No
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
