import { TableCell, TableRow } from "@/components/ui/table";
import { DATE_FORMAT, genderMap } from "@/data/constant";
import { TArtist } from "@/types";
import dayjs from "dayjs";
import AddArtist from "./AddArtist";
import DeleteArtist from "./DeleteArtist";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type props = {
  artist: TArtist;
  index: number;
  offset: number;
};

const ArtistRow = ({ artist, index, offset }: props) => {
  const { user } = useAuth();
  return (
    <TableRow>
      <TableCell>
        <NavLink className="underline" to={`/artists/${artist?.user_id}`}>
          {offset + (++index)}
        </NavLink>
      </TableCell>
      <TableCell>{artist.first_name} {artist.last_name}</TableCell>
      <TableCell>{artist.email}</TableCell>

      <TableCell>{dayjs(artist.dob).format(DATE_FORMAT)}</TableCell>
      <TableCell>{genderMap.get(artist.gender ?? "m")}</TableCell>
      <TableCell>{artist.address}</TableCell>
      <TableCell>{artist.first_release_year}</TableCell>
      <TableCell>{artist.no_of_albums_released}</TableCell>
      <TableCell className=" flex gap-1">
        {user?.role === "artist_manager" ?
          <>
            <AddArtist
              artist={artist}
              key={"Edit"}
              header="Edit Artist"
              title="Edit Artist"
            />
            <DeleteArtist artist={artist} />
          </>
          :
          "Not Authorized"
        }
      </TableCell>
    </TableRow>
  );
};

export default ArtistRow;
