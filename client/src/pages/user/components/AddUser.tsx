import { userFormDetails, userFormSchema } from "@/data/user-form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { createUser } from "@/service/api/user";
import { queryClient } from "@/App";
import { QUERY_KEYS } from "@/data/constant";
import { useState } from "react";
import MutateUser from "./MutateUser";
import { AxiosResponse, CustomError } from "@/types";
import { toast } from "@/hooks/use-toast";

const AddUser = () => {
  const [openModal, setOpenModal] = useState(false);
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
  });

  const { mutate: mutateCreateUser, isLoading } = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      setOpenModal(false);
      form.reset();
    },
    onError: (error: AxiosResponse<CustomError>) => {
      toast({
        variant: "destructive",
        title: "error",
        description: error?.response?.data?.message ?? "Unable to create user",
      });
    }
  });

  return (
    <MutateUser
      isLoading={isLoading}
      header="Add User"
      title="Add User"
      closeModal={() => setOpenModal((prev) => !prev)}
      submitHandler={(data) => {
        mutateCreateUser(data);
      }}
      form={form}
      open={openModal}
      userFormDetails={userFormDetails}
    />
  );
};

export default AddUser;
