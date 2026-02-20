"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import NextImage from "next/image";

import {
  ImageIcon,
  Bold,
  Italic,
  UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
} from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function dataURLtoBlob(dataUrl: string) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function BlogAdd() {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
    const router = useRouter();
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;
  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: "",
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/blogs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit blog");
      }

      return res.json();
    },
    onSuccess: (success) => {
      toast.success(success.message || "Blog published successfully");
      setTitle("");
      editor?.commands.setContent("");
      setThumbnail(null);
      router.push("/dashboard/blog");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to publish blog");
    },
  });

  const handlePublish = () => {
    if (!title || !editor?.getHTML()) {
      toast.error("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", editor.getHTML());

    if (thumbnail) {
      const blob = dataURLtoBlob(thumbnail);
      const file = new File([blob], "thumbnail.jpg", { type: blob.type });
      formData.append("thumbnail", file);
    }
     // console.log(formData);

    mutation.mutate(formData);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-gray-50">
      <div className="p-[40px]">
        <h1 className="text-2xl font-bold mb-[80px]">Blog Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-[16px] font-semibold mb-[16px]"
              >
                Add Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Add your title..."
                className="w-full p-[16px] border border-[#B6B6B6] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <EditorContent
                editor={editor}
                className="min-h-[341px] max-h-[500px] overflow-y-auto p-3 focus:outline-none border-none"
              />

              <div className="border-t border-gray-200 p-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Font</span>
                  <select className="border border-gray-200 rounded px-2 py-1 text-sm">
                    <option>Body</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-1 rounded ${
                      editor?.isActive("bold")
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded ${
                      editor?.isActive("italic")
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Italic size={16} />
                  </button>
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleUnderline().run()
                    }
                    className={`p-1 rounded ${
                      editor?.isActive("underline")
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <UnderlineIcon size={16} />
                  </button>

                  <label htmlFor="editor-image-upload">
                    <div className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                      <ImageIcon size={16} />
                    </div>
                  </label>
                  <input
                    type="file"
                    id="editor-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEditorImageUpload}
                  />
                </div>

                <div className="flex items-center space-x-1">
                  <button className="p-1 rounded hover:bg-gray-100">
                    <AlignLeft size={16} />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <AlignCenter size={16} />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <AlignRight size={16} />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <AlignJustify size={16} />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white border border-gray-200 rounded-md p-4 mt-[40px]">
              <h2 className="font-medium mb-4">Thumbnail</h2>
              <label htmlFor="thumbnail" className="cursor-pointer">
                <div
                  className={`border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center h-[350px] ${
                    thumbnail ? "p-0" : "p-4"
                  }`}
                >
                  {thumbnail ? (
                    <NextImage
                      src={thumbnail}
                      alt="Thumbnail preview"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
            onClick={handlePublish}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Publishing..." : "Publish blog"}
          </button>
        </div>
      </div>
    </div>
  );
}
