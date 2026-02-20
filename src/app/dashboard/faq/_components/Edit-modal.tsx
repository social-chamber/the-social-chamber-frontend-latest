"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";

interface EditFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: {
    id: string;
    title: string;
    description: string;
  };
}

// const token = localStorage.getItem("token");
export default function EditFaqModal({
  isOpen,
  onClose,
  faq,
}: EditFaqModalProps) {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
   // console.log("token", token);
  const { data: faqSingle } = useQuery({
    queryKey: ["faq-single", faq.id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/faqs/${faq.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch FAQ");
      return res.json();
    },
    enabled: !!faq.id && isOpen,
  });

  const [title, setTitle] = useState(faq.title);
  const [description, setDescription] = useState(faq.description);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(faqSingle?.title ?? faq.title);
      setDescription(faqSingle?.description ?? faq.description);
    }
  }, [isOpen, faqSingle, faq.title, faq.description]);

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/faqs/${faq.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question: title, answer: description }), // Correct keys
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update FAQ");
      }

      // const updatedFaq = await res.json();
       // console.log("FAQ updated successfully:", updatedFaq);

      // ✅ Refetch FAQ list
      // queryClient.invalidateQueries({ queryKey: ["faqs"] });

      onClose();
      setTimeout(() => {
        window.location.href = "/dashboard/faq";
      }, 1000);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      alert("Failed to update FAQ. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-lg">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-[#FF6B00]">
              Edit FAQ
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4 text-[#FF6B00]" />
            </Button>
          </div>
          <div className="w-full h-[1px] bg-[#FF6B00] mt-4" />
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#FF6B00]">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#FF6B00]">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 min-h-[150px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 p-6 pt-2 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 border-0 text-gray-700"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#FF6B00] hover:bg-[#e05f00] text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
