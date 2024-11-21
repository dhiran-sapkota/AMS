import { useQuery } from "react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LIMIT, QUERY_KEYS } from "@/data/constant";
import { fetchArtists } from "@/service/api/artist";
import AddArtist from "./components/AddArtist";
import ArtistRow from "./components/ArtistRow";
import { useState } from "react";
import CustomPagination from "@/components/Pagination";
import TableWrapper from "@/components/TableWrapper";
import { useAuth } from "@/contexts/AuthContext";

export default function UserListingPage() {
  const [offset, setOffset] = useState(0);
  const {
    data: artists,
    isLoading,
    error,
  } = useQuery({ queryKey: [QUERY_KEYS.ARTIST, offset], queryFn: () => fetchArtists({ limit: LIMIT, offset: offset }) });

  const { user } = useAuth();
  console.log(artists)

  if (error) return <div>An error has occurred</div>;

  const tableHeaders = ["S.No", "Name", "Email", "Date of birth", "Gender", "Address", "First Release Year", "Number of Albums Released", "Actions"];
  return (
    <Card className="h-full flex flex-col ">
      <CardHeader className=" flex flex-row items-center justify-between">
        <CardTitle>Artists</CardTitle>
        <div>
          {user?.role === "artist_manager" && <AddArtist header="Create Artist" title="Create Artist" />}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <TableWrapper headers={tableHeaders} isLoading={isLoading} length={artists?.data?.data?.length ?? 0} >
          {artists?.data?.data?.map((artist, index) => (
            <ArtistRow offset={offset} key={artist.id} index={index} artist={artist} />
          ))}
        </TableWrapper>
      </CardContent>
      <CardContent>
        <CustomPagination
          totalItems={artists?.data?.total ?? 0}
          itemsPerPage={LIMIT}
          currentPage={offset / LIMIT + 1}
          onPageChange={(page) => setOffset((page - 1) * LIMIT)}
        />
      </CardContent>
    </Card>
  );
}
