/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Pagination } from "@/components/ui/pagination";
import { Plus, Trash2 } from "lucide-react";
// import Image from "next/image";
import React, { useState, useMemo } from "react";
import { AddUploadModal } from "./add-video-modal";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const VideoContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const itemsPerPage = 5;
  const queryClient = useQueryClient();

  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  // const handleSave = (data: any) => {
  //    // console.log("Saved data:", data);
  // };

  const { data } = useQuery({
    queryKey: ["contentVideo"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/assets?type=video`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return res.json();
    },
  });
  const contentVideo = data?.data || [];

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete video");
      }

      return res.json();
    },
    onSuccess: (success) => {
      toast.success(success.message || "Content deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contentVideo"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete content");
    },
  });

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return contentVideo.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, contentVideo]);

  return (
    <div className="h-screen px-10 pb-[87px]">
      <div className="w-full flex items-center justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#FF6900] py-[11.5px] px-6 rounded-md text-sm font-semibold font-poppins text-white"
        >
          Add Video <Plus size={16} />
        </button>
      </div>

      <div className="pt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white border-b border-black/20">
              <th className="text-base font-poppins font-normal text-black text-center py-5 px-2">
                Video
              </th>
              <th className="text-base font-poppins font-normal text-black text-center py-5 px-2">
                Section
              </th>
              <th className="text-base font-poppins font-normal text-black text-center py-5 px-2">
                Type
              </th>
              <th className="text-base font-poppins font-normal text-black text-center py-5 px-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((video: any) => (
              <tr key={video._id} className="bg-white border-b border-black/20">
                <td className="py-4 px-2 text-center">
                  <video width="80" height="60" controls className="w-[40px] h-[60px] mx-auto">
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </td>
                <td className="text-sm font-poppins text-center">
                  {video.section}
                </td>
                <td className="text-sm font-poppins text-center">
                  {video.type}
                </td>
                <td className="text-sm font-poppins text-center">
                  <button
                    onClick={() => {
                      setDeleteId(video._id);
                      setIsDeleteDialogOpen(true);
                    }}
                    aria-label="Delete video"
                  >
                    <Trash2 size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-white rounded-b-[8px]">
          {contentVideo.length > itemsPerPage && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalResults={contentVideo.length}
                resultsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Video Modal */}
      {isOpen && (
        <AddUploadModal
          open={isOpen}
          onOpenChange={setIsOpen}
          // onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this video? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                mutation.mutate(deleteId);
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoContainer;
