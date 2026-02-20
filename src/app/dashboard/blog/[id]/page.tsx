"use client";
import React from "react";
import EditBlog from "../../_components/blog/edit-blog";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  const id = pathname.replace("/dashboard/blog/", "");

  return (
    <div>
      <EditBlog id={id} />
    </div>
  );
};

export default Page;
