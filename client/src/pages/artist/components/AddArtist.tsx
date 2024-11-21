import { queryClient } from "@/App";
import CustomInput from "@/components/CustomInput";
import { Modal } from "@/components/Modal";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { artistFormDetails, artistFormSchema } from "@/data/artist-form";
import { QUERY_KEYS } from "@/data/constant";
import { toast } from "@/hooks/use-toast";
import { createArtist, updateArtist } from "@/service/api/artist";
import { AxiosResponse, CustomError, TArtist, TArtistPayload } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as z from "zod";

type props = {
  artist?: TArtist;
  title: string;
  header: string;
};

const AddArtist = ({ artist, title, header }: props) => {
  const [openModal, setOpenModal] = useState(false);
  const form = useForm<z.infer<typeof artistFormSchema>>({
    resolver: zodResolver(artist ? artistFormSchema.omit({ password: true }) : artistFormSchema),
  });
  const { mutate: mutateCreateArtist, isLoading } = useMutation(createArtist, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTIST] });
      setOpenModal(false);
    },
    onError: (error: AxiosResponse<CustomError>) => {
      toast({
        variant: "destructive",
        title: "error",
        description: error?.response?.data?.message ?? "Unable to create user",
      });
    }
  });

  const { mutate: mutateUpdateArtist, isLoading: isUpdateLoading } = useMutation(
    ({ body, id }: { body: Partial<TArtistPayload>; id: number }) =>
      updateArtist(body, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTIST] });
        setOpenModal(false);
      },
    }
  );

  useEffect(() => {
    if (artist) {
      form.reset({
        ...artist,
        first_release_year: parseInt(artist.first_release_year, 10),
        no_of_albums_released: parseInt(artist.no_of_albums_released ?? "0", 10),
      });
      form.setValue("dob", dayjs(artist.dob).format("YYYY-MM-DD"));
    }
  }, [artist]);

  return (
    <Modal
      closeModal={() => setOpenModal((prev) => !prev)}
      open={openModal}
      header={header}
      title={title}
    >
      <Form {...form}>
        <form
        className="flex flex-col gap-2 overflow-auto max-h-[80vh]"
          onSubmit={form.handleSubmit((data) => {
            if (artist) {
              mutateUpdateArtist({
                body: {
                  ...data,
                  first_release_year: data.first_release_year.toString(),
                  no_of_albums_released: data.no_of_albums_released?.toString(),
                  user_id: artist?.user_id,
                },
                id: artist.id
              });
            } else {
              mutateCreateArtist({
                ...data,
                first_release_year: data?.first_release_year?.toString(),
                no_of_albums_released: data?.no_of_albums_released?.toString(),
              });
            }
          })}
        >
          {artistFormDetails.filter(formitem => !artist ? true : formitem.name !== "password").map((field) => (
            <CustomInput
              control={form.control}
              key={field.name}
              fielddata={field}
            />
          ))}
          <DialogFooter className=" mt-4 sticky bottom-0 bg-background">
            <Button disabled={isLoading || isUpdateLoading} type="submit">
              {(isLoading || isUpdateLoading) && <Spinner />} Save
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
};

export default AddArtist;
