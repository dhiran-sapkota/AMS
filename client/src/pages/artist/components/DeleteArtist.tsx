import { queryClient } from "@/App";
import { Modal } from "@/components/Modal";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@/data/constant";
import { deleteArtist } from "@/service/api/artist";
import { TArtist } from "@/types";
import { useState } from "react";
import { useMutation } from "react-query";

const DeleteArtist = ({ artist }: { artist: TArtist }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useMutation(deleteArtist, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ARTIST] });
      () => setOpen(false);
    },
  });

  return (
    <Modal
      closeModal={() => setOpen((prev) => !prev)}
      header="Delete"
      title={`Delete ${artist.first_name}?`}
      open={open}
    >
      <div>Are you sure you want to delete this artist?</div>

      <Button disabled={isLoading} onClick={() => mutate(artist?.id)} variant={"destructive"}>
        {isLoading && <Spinner />} Delete
      </Button>
    </Modal>
  );
};

export default DeleteArtist;
