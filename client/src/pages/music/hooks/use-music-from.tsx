import { FieldDetails } from "@/data/user-form";
import * as z from "zod";

const musicFormDetails: FieldDetails[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
  },
  {
    name: "album_name",
    label: "Album",
    type: "text",
  },
  {
    name: "genre",
    label: "Genre",
    type: "select",
    options: [
      { label: "RnB", value: "rnb" },
      { label: "Country", value: "country" },
      { label: "Classic", value: "classic" },
      { label: "Rock", value: "rock" },
      { label: "Jazz", value: "jazz" },
    ],
  },
  // {
  //   name: "artist_id",
  //   label: "Artist",
  //   type: "select",
  //   options: [],
  // },
];

const useMusicFrom = () => {
  // const { data: artists, isLoading: isArtistLoading } = useQuery({
  //   queryKey: QUERY_KEYS.ARTIST,
  //   queryFn: () => fetchArtists({ limit: 1000, offset: 0 }),
  // });

  const musicFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    album_name: z.string().min(1, "Album name is required"),
    genre: z.string().min(1, "Genre is required"),
    // artist_id: z.any().refine((val) => Number(val) > 0, {
    //   message: "Artist is required",
    // }),
  });

  return { musicFormInputs : musicFormDetails, musicFormSchema };
};

export default useMusicFrom;
