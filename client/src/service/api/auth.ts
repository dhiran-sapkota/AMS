import {
  LoginFormData,
  LoginResponse,
  Response,
  TUser,
  TUserRegister,
} from "@/types";
import axiosInstance from "../axiosInstance";
import { toast } from "@/hooks/use-toast";

export const login: (
  data: LoginFormData
) => Promise<LoginResponse | null>  = async (data: LoginFormData) => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      {
        user: data
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(error)
    toast({
      variant: "destructive",
      title: "Error",
      description: error?.response?.data?.message ?? "Invalid email or password",
    });
    return null;
  }
};

export const registerUser = async (body: TUserRegister) => {
  const { data } = await axiosInstance.post<Response<TUser>>(
    "/auth/register",
    {
      user : body
    }
  );
  if (data?.success) {
    toast({
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

export const tokenValidate: () => Promise<{
  user: TUser;
} | null>  = async () => {
  try {
    const response = await axiosInstance.get<{ user: TUser }>(
      "/auth/validate-token"
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
