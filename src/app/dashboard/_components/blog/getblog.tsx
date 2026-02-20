"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  SquarePen,
  Loader2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Blog {
  _id?: string;
  title?: string;
  thumbnail?: string;
  createdAt?: string;
}

export default function GetBlog() {
  const queryClient = useQueryClient();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const itemsPerPage = 6;

  const { data } = useQuery({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/blogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete blog");
      return res.json();
    },
    onSuccess: (success) => {
      toast.success(success.message || "Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete blog");
    },
  });

  const blogs = data?.data || [];
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="p-[40px]">
        <div className="flex justify-between items-center mb-[80px]">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <Link href="/dashboard/blog/add">
            <button className="bg-[#FF6900] hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center">
              Add Blog <Plus className="ml-1 h-4 w-4" />
            </button>
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <span className="ml-2">No Data Found ...</span>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-12 px-4 border-b border-gray-200">
              <div className="col-span-6 font-medium py-5 text-[16px]">
                Blog Name
              </div>
              <div className="col-span-3 font-medium py-5 text-[16px]">
                Added
              </div>
              <div className="col-span-3 font-medium py-5 text-right text-[16px]">
                Action
              </div>
            </div>

            {currentBlogs.map((blog: Blog, index: number) => (
              <div
                key={blog._id || index}
                className="grid grid-cols-12 py-4 px-6 border-b border-gray-100 items-center"
              >
                <div className="col-span-6 flex items-center">
                  <div className="relative h-12 w-16 mr-3 overflow-hidden rounded bg-gray-100">
                    {blog.thumbnail ? (
                      <Image
                        src={blog.thumbnail}
                        alt="Blog thumbnail"
                        width={64}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>
                  <span className="truncate">{blog.title || "Untitled"}</span>
                </div>
                <div className="col-span-3 text-gray-600">
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleString()
                    : ""}
                </div>
                <div className="col-span-3 flex justify-end space-x-2">
                  <Link href={`/dashboard/blog/${blog._id}`}>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <SquarePen className="h-5 w-5 text-gray-700" />
                    </button>
                  </Link>

                  <Dialog
                    open={isDialogOpen && selectedBlogId === blog._id}
                    onOpenChange={setIsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <button
                        className="p-1.5 hover:bg-gray-100 rounded"
                        onClick={() => {
                          setSelectedBlogId(blog._id || null);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-5 w-5 text-gray-700" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete the blog post.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        {mutation.isPending ? (
                          <div className="flex items-center justify-center ">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (selectedBlogId)
                                mutation.mutate(selectedBlogId);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center px-5 py-3">
              <div className="text-center text-gray-600 my-4">
                Showing{" "}
                <span className="font-semibold">{currentBlogs.length}</span> of{" "}
                <span className="font-semibold">{blogs.length}</span> blogs —
                Page <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded border ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === pageNum
                          ? "bg-[#FF6900] text-white border-[#FF6900]"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded border ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
