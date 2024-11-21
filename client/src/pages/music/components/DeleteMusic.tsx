import { queryClient } from "@/App";
import { Modal } from "@/components/Modal";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/data/constant";
import { toast } from "@/hooks/use-toast";
import { deleteMusic } from "@/service/api/music";
import { AxiosResponse, CustomError, TMusic } from "@/types";
import { useState } from "react";
import { useMutation } from "react-query";

const DeleteMusic = ({ music }: { music: TMusic }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useMutation(deleteMusic, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MUSIC] });
      () => setOpen(false);
    },
    onError: (error: AxiosResponse<CustomError>) => {
      toast({
        variant: "destructive",
        title: "error",
        description: error?.response?.data?.message ?? "Unable to delete music",
      });
    }
  });

  return (
    <Modal
      closeModal={() => setOpen((prev) => !prev)}
      header="Delete"
      title={`Delete ${music.title}?`}
      open={open}
    >
      <div>Are you sure you want to delete this music?</div>

      <Button disabled={isLoading} onClick={() => mutate(music?.id)} variant={"destructive"}>
        {isLoading && <Spinner />}
        Delete
      </Button>
    </Modal>
  );
};

export default DeleteMusic;
