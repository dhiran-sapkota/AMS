import { useMutation, useQuery } from "react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bulkDownloadMusic, bulkMusicUpload, fetchMusic } from "@/service/api/music";
import AddMusic from "./components/AddMusic";
import MusicRow from "./components/MusicRow";
import { LIMIT, QUERY_KEYS } from "@/data/constant";
import CustomPagination from "@/components/Pagination";
import { useEffect, useState } from "react";
import TableWrapper from "@/components/TableWrapper";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowDown, ArrowUp, CloudDownload, CloudUpload } from "lucide-react";
import { AxiosResponse, CustomError } from "@/types";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/App";
import Spinner from "@/components/Spinner";
import Search from "@/components/Search";

export default function MusicListingPage() {
  const [offset, setOffset] = useState(0);
  const { isAuthenticated, isLoading: isFetching, user } = useAuth();
  const params = useParams();
  const [artistId, setArtistId] = useState<number | null>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isFetching) return;
    if (!isAuthenticated) return;
    if (params?.id) {
      setArtistId(Number(params?.id));
    } else {
      setArtistId(user?.user_id ?? null);
    }
  }, [isFetching, isAuthenticated, user, params]);

  const [sortingInfo, setSortingInfo] = useState<{
    order: "desc" | "asc" | null;
    order_by: "created_at" | "title" | "album_name" | null;
  }>({
    order: null,
    order_by: null,
  });

  const {
    data: music,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.MUSIC, offset, artistId, search, sortingInfo],
    queryFn: () =>
      fetchMusic({
        limit: LIMIT,
        offset: offset,
        artist_id: Number(artistId),
        query: search,
        sort_by : sortingInfo.order_by,
        sort_order : sortingInfo.order
      }),
    enabled: !!artistId,
  });

  const { data: allMusic, isLoading: isAllMusicLoading } = useQuery({
    queryKey: [QUERY_KEYS.MUSIC, offset, artistId],
    queryFn: () =>
      bulkDownloadMusic( Number(artistId) ),
    enabled: !!artistId,
  });

  const { mutate: uploadBulk, isLoading: isMusicUploading } = useMutation(bulkMusicUpload, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MUSIC] });
    },
    onError: (error: AxiosResponse<CustomError>) => {
      if(error?.response?.data?.errors && error?.response?.data?.errors?.length>0){
        error?.response?.data?.errors.forEach((error)=>(
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: error ?? "Unable to upload in bulk",
          })
        ))
      }else{
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: error?.response?.data?.message ?? "Unable to upload in bulk",
        });
      }
    }
  });


  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDownload = async () => {
    const musicData = allMusic?.data.toString() ?? "";
    const csvBlob = new Blob([musicData], { type: "text/csv" });
    const url = window.URL.createObjectURL(csvBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "music.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    const formdata = new FormData()
    formdata.append("file", file as File)
    uploadBulk(formdata)
  }  

  if (error) return <div>An error has occurred</div>;

  const headers = [
    "S.No",
    <div className="flex items-center">
      <div className=" mr-2"> Title </div>
      <ArrowUp
        onClick={() => {
          if (sortingInfo.order === "asc" && sortingInfo.order_by === "title"){
            setSortingInfo({ order: null, order_by: null });
          }else{
            setSortingInfo({ order: "asc", order_by: "title" });
          }
        }}
        className={`h-4 cursor-pointer w-4 ${ sortingInfo.order==="asc" && sortingInfo.order_by==="title" && "text-black" } `}
      />
      <ArrowDown
        onClick={() => {
          if (sortingInfo.order === "desc" && sortingInfo.order_by === "title"){
            setSortingInfo({ order: null, order_by: null });
          }else{
            setSortingInfo({ order: "desc", order_by: "title" });
          }
        }}
        className={`h-4 cursor-pointer w-4 ${ sortingInfo.order==="desc" && sortingInfo.order_by==="title" && "text-black" } `}
      />
    </div>,
    <div className="flex items-center">
    <div className=" mr-2"> Album </div>
    <ArrowUp
      onClick={() => {
        if (sortingInfo.order === "asc" && sortingInfo.order_by === "album_name"){
          setSortingInfo({ order: null, order_by: null });
        }else{
          setSortingInfo({ order: "asc", order_by: "album_name" });
        }
      }}
      className={`h-4 cursor-pointer w-4 ${ sortingInfo.order==="asc" && sortingInfo.order_by==="album_name" && "text-black" } `}
    />
    <ArrowDown
      onClick={() => {
        if (sortingInfo.order === "desc" && sortingInfo.order_by === "album_name"){
          setSortingInfo({ order: null, order_by: null });
        }else{
          setSortingInfo({ order: "desc", order_by: "album_name" });
        }
      }}
      className={`h-4 cursor-pointer w-4 ${ sortingInfo.order==="desc" && sortingInfo.order_by==="album_name" && "text-black" } `}
    />
  </div>,
    "Genre",
    "Artist",
    "Action",
  ];

  return (
    <Card className="h-full flex flex-col ">
      <CardHeader className=" flex flex-row items-center justify-between">
        <div className=" flex items-center gap-4">
          <CardTitle>Music</CardTitle>
          <div>
            <Search setSearch={setSearch} />
          </div>
        </div>
          <div className="flex gap-2">
            <Button variant={"outline"} onClick={handleDownload}>
              {isAllMusicLoading ? <Spinner /> : <CloudDownload />}
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant={"outline"}
              >
                <Label htmlFor="file">
                  <CloudUpload />
                </Label>
                <Input
                  className="hidden"
                  type="file"
                  id="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </Button>
              <Button onClick={handleUpload} disabled={!file}>
                {isMusicUploading ? <Spinner /> : "Upload CSV"}
              </Button>
            </div>
            { user?.role ==="artist" && <AddMusic header="Add Music" title="Add Music" /> }
          </div>
        {/* )} */}
      </CardHeader>
      <CardContent className=" flex-1">
        <TableWrapper
          headers={headers}
          isLoading={isLoading}
          length={music?.data?.data.length ?? 0}
        >
          {music?.data?.data?.map((track, index) => (
            <MusicRow
              offset={offset}
              key={track.id}
              index={index}
              track={track}
            />
          ))}
        </TableWrapper>
      </CardContent>
      <CardContent>
        <CustomPagination
          totalItems={Number(music?.data?.total) ?? 0}
          itemsPerPage={LIMIT}
          currentPage={offset / LIMIT + 1}
          onPageChange={(page) => {
            setOffset((page - 1) * LIMIT);
          }}
        />
      </CardContent>
    </Card>
  );
}
