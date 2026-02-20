"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, CloudUpload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  section: z.string().min(1, { message: "Please select a section" }),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ImageUploadModalProps {
  editOpen: boolean;
  editonOpenChange: (open: boolean) => void;
  id: string;
}

export function EditeImageModal({
  editOpen,
  editonOpenChange,
  id,
}: ImageUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session?.user as { accessToken: string })?.accessToken;

  const { data: getData } = useQuery({
    queryKey: ["ContentImageOne", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/assets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch asset");
      return res.json();
    },
    enabled: !!id && !!token,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section: "",
      image: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (getData?.data) {
      form.setValue("section", getData.data.section);
      setPreview(getData.data.url);
    }
  }, [getData, form]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      form.setValue("image", file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const updateAsset = async (data: FormValues) => {
    // let imageUrl = getData.data.url;
      
    // If new image uploaded, upload first
    if (data.image instanceof File) {
      const formData = new FormData();
      formData.append("file", data.image);
      formData.append("type", "image");
      formData.append("section", data.section);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!uploadRes.ok) throw new Error("Image upload failed");
      // const uploadData = await uploadRes.json();
      // imageUrl = uploadData?.url || uploadData?.path;
    }

    // const updateRes = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/assets/${id}`,
    //   {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({
    //       section: data.section,
    //       url: imageUrl,
    //     }),
    //   }
    // );

    // if (!updateRes.ok) throw new Error("Failed to update image asset");
    // return await updateRes.json();
  };

  const mutation = useMutation({
    mutationFn: updateAsset,
    onSuccess: () => {
      toast.success("Image asset updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ContentImageOne", id] });
      resetForm();
      editonOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Update failed");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const resetForm = () => {
    form.reset();
    setPreview(null);
  };

  return (
    <Dialog open={editOpen} onOpenChange={editonOpenChange}>
      <DialogContent className="w-full md:w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between pb-[15px]">
            <DialogTitle className="text-2xl font-semibold text-[#FF6600]">
              Edit Image
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
                <FormItem>
                  <FormLabel className="text-base text-[#FF6900]">
                    Section
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="hero">Hero</SelectItem>
                      {/* <SelectItem value="banner">Banner</SelectItem> */}
                      <SelectItem value="sub-hero">Sub Hero</SelectItem>
                      <SelectItem value="space-hero">Space Hero</SelectItem>
                      <SelectItem value="experience-hero">
                        Experience Hero
                      </SelectItem>
                      <SelectItem value="updates-hero">Updates Hero</SelectItem>
                      <SelectItem value="contact-hero">Contact Hero</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#FF6900]">
                    Upload Image
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "border-2 rounded-md p-4 cursor-pointer",
                        preview ? "p-2" : "p-8",
                        "border-gray-300 hover:border-[#FF6900]"
                      )}
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      {preview ? (
                        <div className="relative h-[190px]">
                          <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="rounded-md object-contain"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreview(null);
                              form.setValue("image", null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-[140px] flex flex-col items-center justify-center gap-2">
                          <CloudUpload className="h-[40px] w-[40px] text-gray-400" />
                          <p className="text-gray-400">
                            Click to upload an image
                          </p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleFileInput(e);
                          field.onChange(e.target.files?.[0]);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center gap-6 mt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  editonOpenChange(false);
                }}
                className="bg-[#D9D9D9] rounded py-3 px-6 text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!form.formState.isValid || mutation.isPending}
                className="bg-[#FF6900] rounded py-3 px-6 text-white"
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
