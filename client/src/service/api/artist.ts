import {
  ListResponse,
  Pagination,
  Response,
  TArtist,
  TArtistPayload,
} from "@/types";
import axiosInstance from "../axiosInstance";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export const fetchArtists = async ({ limit, offset }: Pagination) => {
  const  data  = await axiosInstance.get<ListResponse<TArtist>>(
    `/artists?limit=${limit}&offset=${offset}`
  );
  return data;
};

export const createArtist = async (body: TArtistPayload) => {
    const { data } = await axiosInstance.post<Response<TArtist>>(
      "/artists",
      {artist:  body}
    );
    if (data?.success) {
      toast({
        title: "Success",
        description: data?.message ?? "Artist created Successfully",
      });
      return data;
    } else {
      toast({
        title: "Success",
        description: data?.message ?? "Unable to create artist",
      });
    }
};

export const updateArtist = async (
  body: Partial<TArtistPayload>,
  id: number
) => {
  const { data } = await axiosInstance.patch<Response<TArtist>>(
    `/artists/${id}`,
    { artist: body }
  );
  if (data?.success) {
    toast({
      title: "Success",
      description: data?.message ?? "Artist updated Successfully",
    });
    return data;
  } else {
    toast({
      title: "Success",
      description: data?.message ?? "Unable to update artist",
    });
  }
};

export const deleteArtist = async (id: number) => {
  try{
  const { data } = await axiosInstance.delete<Response<TArtist>>(
    `/artists/${id}`
  );
  if (data?.success) {
    toast({
      title: "Success",
      description: data?.message ?? "Artist deleted Successfully",
    });
    console.log(data)
  
    return data;
  }
}catch(err : any){
  toast({
    variant: "destructive",
    title: "Failure",
    description: err?.response?.data?.message ?? "Unable to delete artist",
  });
}
};
