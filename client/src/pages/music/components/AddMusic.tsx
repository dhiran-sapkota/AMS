import { queryClient } from "@/App";
import CustomInput from "@/components/CustomInput";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { QUERY_KEYS } from "@/data/constant";
import { createMusic, updateMusic } from "@/service/api/music";
import { AxiosResponse, CustomError, TMusic, TMusicPayload } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as z from "zod";
import useMusicFrom from "../hooks/use-music-from";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/Spinner";
import { toast } from "@/hooks/use-toast";

type props = {
  music?: TMusic;
  title: string;
  header: string;
};

const AddMusic = ({ music, title, header }: props) => {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();
  const { musicFormInputs, musicFormSchema } = useMusicFrom();
  const form = useForm<z.infer<typeof musicFormSchema>>({
    resolver: zodResolver(musicFormSchema),
  });

  const { mutate: mutateMusic, isLoading: isMusicCreating } = useMutation(createMusic, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MUSIC] });
      setOpenModal(false);
    },
    onError: (error: AxiosResponse<CustomError>) => {
      toast({
        variant: "destructive",
        title: "error",
        description: error?.response?.data?.message ?? "Unable to create music",
      });
    }
  });

  const { mutate: mutateUpdateMusic, isLoading: isMusicUpdating } = useMutation(
    ({ body, id }: { body: Partial<TMusicPayload>; id: number }) =>
      updateMusic(body, id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MUSIC] });
        setOpenModal(false);
      },
      onError: (error: AxiosResponse<CustomError>) => {
        toast({
          variant: "destructive",
          title: "error",
          description: error?.response?.data?.message ?? "Unable to update music",
        });
      }
    }
  );

  useEffect(() => {
    if (music) {
      form.reset(music);
    }
  }, [music]);

  return (
    <Modal
      closeModal={() => setOpenModal((prev) => !prev)}
      open={openModal}
      header={header}
      title={title}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (music) {
              mutateUpdateMusic({ body: data, id: music.id });
            } else {
              console.log(user?.id)
              mutateMusic({ ...data, artist_id: Number(user?.id) });
            }
          })}
        >
          {musicFormInputs.map((field) => (
            <CustomInput
              control={form.control}
              key={field.name}
              fielddata={field}
            />
          ))}
          <DialogFooter className=" mt-4">
            <Button disabled={isMusicCreating || isMusicUpdating} type="submit">{(isMusicCreating || isMusicUpdating) && <Spinner />} Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
};

export default AddMusic;
