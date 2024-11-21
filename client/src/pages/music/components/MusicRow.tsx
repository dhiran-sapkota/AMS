import { TableCell, TableRow } from "@/components/ui/table";
import { TMusic } from "@/types";
import AddMusic from "./AddMusic";
import DeleteMusic from "./DeleteMusic";
import { useAuth } from "@/contexts/AuthContext";
type props = {
  track: TMusic;
  index: number;
  offset: number;
};
const MusicRow = ({ index, track, offset }: props) => {
  const { isLoading, user } = useAuth();
  return (
    <TableRow>
      <TableCell>{offset + (++index)}</TableCell>
      <TableCell>{track.title}</TableCell>
      <TableCell>{track.album_name}</TableCell>
      <TableCell>{track.genre}</TableCell>
      <TableCell>{track.artist_name}</TableCell>
      <TableCell className=" flex gap-2">
        {!isLoading && (user?.role === "artist" ? <> <AddMusic music={track} header="Edit Music" title="Edit Music" />
          <DeleteMusic music={track} /> </> : "Not Authorized")}
      </TableCell>
    </TableRow>
  );
};

export default MusicRow;
