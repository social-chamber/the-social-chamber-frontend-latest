"use client";

import { useState } from "react";
import { SquarePen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingPagination } from "../../booking/_components/booking-pagination";
import AddFaqModal from "./Add-faq-modal";
import EditFaqModal from "./Edit-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// ConfirmDeleteModal component inside this file for simplicity,
// or you can move it to its own file.
const ConfirmDeleteModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 w-full"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
        <p className="text-base text-gray-600 mb-7">This action cannot be undone. Do you want to delete this promo code?</p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

interface FAQ {
  id: string;
  title: string;
  description: string;
}

const FaqPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);

  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
   // console.log("token", token);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New state for delete confirmation modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  
  const queryClient = useQueryClient();

  const {
    data: faqData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/faqs`,
        {
          method: "GET",
          
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch FAQs");
      }

      return res.json();
    },
   
  });

  const faqAllData = faqData?.data || [];
  const totalItems = faqAllData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItemStart = (currentPage - 1) * itemsPerPage + 1;
  const currentItemEnd = Math.min(currentPage * itemsPerPage, totalItems);
  const currentFaqs = faqAllData.slice(currentItemStart - 1, currentItemEnd);

  const handleEditFaq = (faq: any) => {
    setSelectedFaq({
      id: faq._id,
      title: faq.question,
      description: faq.answer,
    });
    setIsEditModalOpen(true);
  };

  
  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/faqs/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete FAQ");
      }

      return res.json();
    },
    onMutate: () => {
      toast.loading("Deleting FAQ...", { id: "deleteToast" });
    },
    onSuccess: () => {
      toast.success("FAQ deleted successfully", { id: "deleteToast" });
      queryClient.invalidateQueries({ queryKey: ["faq"] });
    },
    onError: () => {
      toast.error("Failed to delete FAQ", { id: "deleteToast" });
    },
  });

  
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Confirm delete action from modal
  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteFaqMutation.mutate(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return <div className="p-6">Loading FAQs...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load FAQs.</div>;
  }

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <div className="flex justify-between items-center p-6 mb-[70px]">
        <h1 className="text-2xl font-semibold px-3">FAQ Management</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#FF6B00] hover:bg-[#e05f00] text-white"
        >
          Add FAQ <span className="ml-1">+</span>
        </Button>
      </div>

      <div className="w-[96%] mx-auto bg-[#FFFFFF] rounded-lg">
        <Table className="rounded-xl">
          <TableHeader>
            <TableRow>
              <TableHead className="px-20 py-4 text-base text-black">ID</TableHead>
              <TableHead className="px-20 py-4 text-base text-black">Title</TableHead>
              <TableHead className="px-20 py-4 text-base text-black">Description</TableHead>
              <TableHead className="px-20 py-4 text-base text-black">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFaqs.map((faq: any, index: number) => (
              <TableRow key={faq._id}>
                <TableCell className="px-20 py-3 text-base text-black">{index + 1}</TableCell>
                <TableCell className="px-20 py-3 text-base text-black">{faq.question}</TableCell>
                <TableCell className="px-20 py-3 text-base text-black">{faq.answer}</TableCell>
                <TableCell className="px-[70px] py-3">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditFaq(faq)}
                    >
                      <SquarePen className="h-6 w-6 text-black" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(faq._id)}
                    >
                      <Trash className="h-6 w-6 text-black" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="bg-[#FFFFFF] rounded-lg">
          <BookingPagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            currentItemStart={currentItemStart}
            currentItemEnd={currentItemEnd}
          />
        </div>
      </div>

      {isAddModalOpen && (
        <AddFaqModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && selectedFaq && (
        <EditFaqModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          faq={selectedFaq}
        />
      )}

      {/* Confirmation modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default FaqPage;
