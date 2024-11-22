import {
  ListResponse,
  Pagination,
  Response,
  TUser,
  TUserPayload,
} from "@/types";
import axiosInstance from "../axiosInstance";
import { toast } from "@/hooks/use-toast";

export const fetchUsers = async ({ limit = 10, offset, query="", sortingInfo }: Pagination) => {
  let usersString = `/users?limit=${limit}&offset=${offset}&query=${query}` 
  if(sortingInfo?.order && sortingInfo?.order_by) usersString += `&sort_by=${sortingInfo.order_by}&sort_order=${sortingInfo.order}` 
  const data = await axiosInstance.get<ListResponse<TUser>>(usersString);
  return data;
};

export const createUser = async (body: TUserPayload) => {
  const { data } = await axiosInstance.post<Response<TUser>>(
    "/users",
    { user: body }
  );
  if (data?.success) {
    toast({
      variant: "default",
      title: "Success",
      description: data?.message ?? "User created Successfully",
    });
    return data;
  } else {
    toast({
      title: "Success",
      description: data?.message ?? "Unable to create user",
    });
  }
};

export const updateUser = async (body: Partial<TUserPayload>, id: number) => {
    const { data } = await axiosInstance.patch<Response<TUser>>(
      `/users/${id}`,
      body
    );
    if (data?.success) {
      toast({
        title: "Success",
        description: data?.message ?? "User updated Successfully",
      });
      return data;
    } else {
      toast({
        title: "Success",
        description: data?.message ?? "Unable to update user",
      });
    }
};

export const deleteUser = async (id: number) => {
    const { data } = await axiosInstance.delete<Response<TUser>>(
      `/users/${id}`
    );
    if (data?.success) {
      toast({
        title: "Success",
        description: data?.message ?? "User deleted Successfully",
      });
      return data;
    } else {
      toast({
        title: "Success",
        description: data?.message ?? "Unable to delete user",
      });
    }
};
