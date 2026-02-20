"use client";

import type React from "react";
import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Play, Pause, CloudUpload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Zod schema
const formSchema = z.object({
  section: z.string().min(1, { message: "Please select a section" }),
  video: z
    .any()
    .refine((file) => file !== null, { message: "Please upload a video" }),
});

type FormValues = z.infer<typeof formSchema>;

interface VideoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // onSave?: (data: FormValues) => void;
}

export function AddUploadModal({
  open,
  onOpenChange,
  // onSave,
}: VideoUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { data } = useSession();
  const token = (data?.user as { accessToken: string })?.accessToken;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section: "",
      video: null,
    },
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("video/")) {
      handleVideoChange(file);
    } else {
      alert("Please upload a valid video file");
    }
  };

  // const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file?.type.startsWith("video/")) {
  //     handleVideoChange(file);
  //   } else {
  //     alert("Please upload a valid video file");
  //   }
  // };

  const handleVideoChange = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    form.setValue("video", file, { shouldValidate: true });

    const videoUrl = URL.createObjectURL(file);
    setPreview(videoUrl);
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to submit content");
      return res.json();
    },
    onSuccess: (success) => {
       onOpenChange(false);
      toast.success(success.message || "Content published successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to publish content");
    },
  });

  const onSubmit = (data: FormValues) => {
    // onSave(data);
    const formData = new FormData();
    formData.append("file", data.video); // binary format
    formData.append("type", "video");
    formData.append("section", data.section);
    mutation.mutate(formData);
    resetForm();
   
  };

  const resetForm = () => {
    form.reset();
    setPreview(null);
    setIsPlaying(false);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between pb-[15px]">
            <DialogTitle className="text-2xl md:text-[28px] lg:text-[32px] font-semibold font-poppins leading-[120%] tracking-[0%] text-[#FF6600]">
              Add Videos
            </DialogTitle>
            <DialogClose className="text-[#FF6600] hover:text-[#FF6600]/80">
              <X className="h-6 w-6" />
            </DialogClose>
          </div>
          <div className="h-[2px] w-full bg-[#FF6900]" />
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 py-4"
          >
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem className="space-y-[10px]">
                  <FormLabel className="text-base font-poppins font-medium text-[#FF6900]">
                    Section
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-[44px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="hero">Hero</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={({}) => (
                <FormItem className="space-y-[10px]">
                  <FormLabel className="text-base font-poppins font-medium text-[#FF6900]">
                    Upload Video
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "border-2 border-[#E5E7EB] rounded-md cursor-pointer transition-colors",
                        isDragging ? "border-[#FF6600] bg-[#FF6600]/5" : "",
                        preview ? "p-2" : "p-8"
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("video-upload")?.click()
                      }
                    >
                      {isUploading && (
                        <div className="mb-4 px-4">
                          <p className="text-sm text-gray-500 mb-2">
                            Uploading... {uploadProgress}%
                          </p>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      {preview ? (
                        <div className="h-[190px] relative">
                          <video
                            ref={videoRef}
                            src={preview}
                            className="max-h-[190px] w-full rounded-md bg-black object-contain"
                            onEnded={() => setIsPlaying(false)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-full bg-black/50 border-0 hover:bg-black/70"
                              onClick={togglePlayPause}
                            >
                              {isPlaying ? (
                                <Pause className="h-5 w-5 text-white" />
                              ) : (
                                <Play className="h-5 w-5 text-white" />
                              )}
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 bg-black/50 border-0 hover:bg-black/70"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreview(null);
                              form.setValue("video", null);
                              setIsPlaying(false);
                            }}
                          >
                            <X className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-[140px] flex flex-col items-center justify-center gap-2 py-4">
                          <CloudUpload className="h-[40px] w-[40px] text-gray-400" />
                        </div>
                      )}
                      <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file?.type.startsWith("video/")) {
                            handleVideoChange(file);
                            form.setValue("video", file, {
                              shouldValidate: true,
                            }); // manual set
                          } else {
                            alert("Please upload a valid video file");
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center items-center gap-[30px] mt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
                className="bg-[#D9D9D9] rounded-[8px] py-3 px-6 text-black font-poppins font-medium text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isUploading || !form.formState.isValid || mutation.isPending
                }
                className="bg-[#FF6900] rounded-[8px] py-3 px-6 text-white font-poppins font-medium text-base"
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
