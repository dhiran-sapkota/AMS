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
import { usePrepareHeaders } from "@/hooks/use-prepare-headers";
import Search from "@/components/Search";

const headerDetails = [
  {
    title: "S.No."
  },
  {
    title: "Name",
    value: "firstname"
  },
  {
    title: "Email",
    value: "email"
  },
  {
    title: "Date of Birth"
  },
  {
    title: "Gender",
  },
  {
    title: "Address",
    value: "address"
  },
  {
    title: "First Release Year",
    value: "first_release_year"
  },
  {
    title: "Number of Albums Released"
  },
  {
    title: "Actions"
  }
]

export default function UserListingPage() {
  const [offset, setOffset] = useState(0);
  const { headers, sortingInfo } = usePrepareHeaders(headerDetails)
  const [search, setSearch] = useState("")
  const {
    data: artists,
    isLoading,
    error,
  } = useQuery({ queryKey: [QUERY_KEYS.ARTIST, offset, search, sortingInfo], queryFn: () => fetchArtists({ limit: LIMIT, offset: offset, sortingInfo: sortingInfo, query : search }) });

  const { user } = useAuth();

  if (error) return <div>An error has occurred</div>;


  return (
    <Card className="h-full flex flex-col ">
      <CardHeader className=" flex flex-row items-center justify-between">
        <div className=" flex items-center gap-4">
          <CardTitle>Artists</CardTitle>
          <Search setSearch={setSearch} />
        </div>
        <div>
          {user?.role === "artist_manager" && <AddArtist header="Create Artist" title="Create Artist" />}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <TableWrapper headers={headers} isLoading={isLoading} length={artists?.data?.data?.length ?? 0} >
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
