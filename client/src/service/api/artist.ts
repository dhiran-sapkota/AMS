import {
  ListResponse,
  Pagination,
  Response,
  TArtist,
  TArtistPayload,
} from "@/types";
import axiosInstance from "../axiosInstance";
import { toast } from "@/hooks/use-toast";

export const fetchArtists = async ({ limit, offset, query="", sortingInfo }: Pagination) => {
  let queryString = `/artists?limit=${limit}&offset=${offset}&query=${query}`
  if(sortingInfo?.order && sortingInfo.order_by) queryString += `&sort_by=${sortingInfo.order_by}&sort_order=${sortingInfo.order}`  
  const  data  = await axiosInstance.get<ListResponse<TArtist>>(queryString);
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
