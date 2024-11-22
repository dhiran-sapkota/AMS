import {
  ListResponse,
  Pagination,
  Response,
  TMusic,
  TMusicPayload,
} from "@/types";
import axiosInstance from "../axiosInstance";
import { toast } from "@/hooks/use-toast";

export const fetchMusic = async ({
  limit,
  offset,
  artist_id,
  query,
  sort_by,
  sort_order,
}: Pagination & {
  artist_id?: number;
  query?: string;
  sort_by?: "created_at" | "title" | "album_name" | null;
  sort_order?: "desc" | "asc" | null;
}) => {
  if (artist_id) {
    let requestStr = `/musics?id=${artist_id}&limit=${limit}&offset=${offset}&query=${
      query ?? ""
    }`;
    if (sort_by && sort_order) requestStr += (`&sort_by=${sort_by}&sort_order=${sort_order}`)
    const data = await axiosInstance.get<ListResponse<TMusic>>(requestStr);
    return data;
  }
};

export const createMusic = async (body: TMusicPayload) => {
  const { data } = await axiosInstance.post<Response<TMusic>>("/musics/", body);
  if (data?.success) {
    toast({
      title: "Success",
      description: data?.message ?? "Music created Successfully",
    });
    return data;
  } else {
    toast({
      title: "Success",
      description: data?.message ?? "Unable to create music",
    });
  }
};

export const updateMusic = async (body: Partial<TMusicPayload>, id: number) => {
  const { data } = await axiosInstance.patch<Response<TMusic>>(
    `/musics/${id}`,
    body
  );
  if (data?.success) {
    toast({
      title: "Success",
      description: data?.message ?? "Music updated Successfully",
    });
    return data;
  } else {
    toast({
      title: "Success",
      description: data?.message ?? "Unable to update music",
    });
  }
};

export const deleteMusic = async (id: number) => {
  const { data } = await axiosInstance.delete<Response<TMusic>>(
    `/musics/${id}`
  );
  if (data?.success) {
    toast({
      title: "Success",
      description: data?.message ?? "Music deleted Successfully",
    });
    return data;
  } else {
    toast({
      title: "Success",
      description: data?.message ?? "Unable to delete music",
    });
  }
};

export const bulkUploadMusic = async (body: TMusicPayload[]) => {
  const { data } = await axiosInstance.post<Response<TMusic>>(
    "/music/create/bulk",
    body
  );
  if (data?.success) {
    toast({
      title: "Success",
      description: data?.message ?? "Music uploaded Successfully",
    });
    return data;
  } else {
    toast({
      title: "Success",
      description: data?.message ?? "Unable to upload music",
    });
  }
};
