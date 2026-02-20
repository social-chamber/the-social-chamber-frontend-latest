"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface AddFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFaqModal({ isOpen, onClose }: AddFaqModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
   // console.log("token", token);

  const handleSubmit = async () => {
    const faqData = { question, answer };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/faqs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(faqData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create promo code");
      }

      // const result = await response.json();
       // console.log("Success:", result);

      setQuestion("");
      setAnswer("");
      onClose();
      toast.success("FAQ created successfully");
      setInterval(() => {
        window.location.href = "/dashboard/faq";
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create FAQ.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-lg">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-[#FF6B00]">
              Add FAQ
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
            <Label htmlFor="question" className="text-[#FF6B00]">
              Question
            </Label>
            <Input
              id="question"
              placeholder="Enter your question"
              className="bg-gray-50"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer" className="text-[#FF6B00]">
              Answer
            </Label>
            <Textarea
              id="answer"
              placeholder="Enter the answer"
              className="bg-gray-50 min-h-[150px] resize-none"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 p-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 border-0 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            className="bg-[#FF6B00] hover:bg-[#e05f00] text-white"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
