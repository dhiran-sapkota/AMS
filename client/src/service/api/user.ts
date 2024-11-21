import {
  ListResponse,
  Pagination,
  Response,
  TUser,
  TUserPayload,
} from "@/types";
import axiosInstance from "../axiosInstance";
import { toast } from "@/hooks/use-toast";

export const fetchUsers = async ({ limit = 10, offset }: Pagination) => {
  const data = await axiosInstance.get<ListResponse<TUser>>(
    `/users?limit=${limit}&offset=${offset}`
  );
  console.log(data, "data")
  return data;
};

export const createUser = async (body: TUserPayload) => {
  const { data } = await axiosInstance.post<Response<TUser>>(
    "/user/create",
    body
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
      `/user/update/${id}`,
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
      `/user/delete/${id}`
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
