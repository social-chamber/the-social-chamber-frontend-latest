"use client";

import { useQuery } from "@tanstack/react-query";

export type CmsAsset = {
  _id: string;
  section: string;
  type: "image" | "video" | string;
  url: string;
  public_id?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CmsAssetsResponse = {
  status: boolean;
  message: string;
  data: CmsAsset[];
};

export function useCmsAssets(section: string) {
  const { data, isLoading, isError, error } = useQuery<CmsAssetsResponse>({
    queryKey: ["cms-assets", section],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/assets?section=${encodeURIComponent(
          section
        )}`,
        { headers: { "cache-control": "no-cache" } }
      );
      // Gracefully handle 404 or empty
      if (!res.ok) {
        return { status: false, message: "Failed", data: [] } as CmsAssetsResponse;
      }
      return res.json();
    },
  });

  const assets = data?.data ?? [];
  const primary = assets[0];

  return { assets, primary, isLoading, isError, error };
}


