import {
  userFormDetails,
  userFormSchema,
  userUpdateSchema,
} from "@/data/user-form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { updateUser } from "@/service/api/user";
import { queryClient } from "@/App";
import { DATE_FORMAT, QUERY_KEYS } from "@/data/constant";
import { useEffect, useState } from "react";
import { AxiosResponse, CustomError, TUser, TUserPayload } from "@/types";
import MutateUser from "./MutateUser";
import { toast } from "@/hooks/use-toast";
import dayjs from "dayjs";

type props = {
  header: string;
  title: string;
  userData?: TUser;
};

const UpdateUser = ({ header, title, userData }: props) => {
  const [openModal, setOpenModal] = useState(false);
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userUpdateSchema),
  });

  const { mutate: mutateUpdateUser, isLoading } = useMutation(
    ({ body, id }: { body: Partial<TUserPayload>; id: number }) =>
      updateUser(body, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
        setOpenModal(false);
      },
      onError: (error: AxiosResponse<CustomError>) => {
        toast({
          variant: "destructive",
          title: "error",
          description: error?.response?.data?.message ?? "Unable to update user",
        });
      }
    }
  );

  useEffect(() => {
    if (userData) {
      form.reset(userData);
      form.setValue("dob", dayjs(userData.dob).format(DATE_FORMAT));
    }
  }, [userData]);

  return (
    <MutateUser
      closeModal={() => setOpenModal((prev) => !prev)}
      form={form}
      header={header}
      open={openModal}
      submitHandler={(data) => {
        mutateUpdateUser({ body: data, id: Number(userData?.id) });
      }}
      isLoading={isLoading}
      title={title}
      userFormDetails={userFormDetails.filter(
        (data) => data.name !== "password"
      )}
    />
  );
};

export default UpdateUser;
