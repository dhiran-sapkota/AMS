import { useQuery } from "react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUsers } from "@/service/api/user";
import UserRow from "./components/UserRow";
import AddUser from "./components/AddUser";
import { LIMIT, QUERY_KEYS } from "@/data/constant";
import CustomPagination from "@/components/Pagination";
import { useState } from "react";
import TableWrapper from "@/components/TableWrapper";
import Search from "@/components/Search";
import { usePrepareHeaders } from "@/hooks/use-prepare-headers";

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
    title: "Phone",
    value: "phone"
  },
  {
    title: "Date of Birth"
  },
  {
    title: "Gender"
  },
  {
    title: "Address",
    value: "address"
  },
  {
    title: "Role"
  },
  {
    title: "Actions"
  }
]

export default function UserListingPage() {
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const {headers, sortingInfo} = usePrepareHeaders(headerDetails)
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER, offset, search, sortingInfo],
    queryFn: () => fetchUsers({
      limit: LIMIT, offset: offset, query: search, sortingInfo
    }),
  });

  if (error) return <div>An error has occurred</div>;

  return (
    <Card className="h-full flex flex-col ">
      <CardHeader className=" flex flex-row items-center justify-between">
        <div className=" flex items-center gap-4">
          <CardTitle>Users</CardTitle>
          <Search setSearch={setSearch} />
        </div>
        <div>
          <AddUser />
        </div>
      </CardHeader>
      <CardContent className=" flex-1">
        <TableWrapper headers={headers} isLoading={isLoading} length={users?.data?.data.length ?? 0}>
          {
            users?.data?.data?.map((user, index) => (
              <UserRow offset={offset} user={user} index={index} key={user?.id} />
            ))
          }
        </TableWrapper>
      </CardContent>
      <CardContent>
        <CustomPagination
          totalItems={users?.data?.total ?? 0}
          itemsPerPage={LIMIT}
          currentPage={offset / LIMIT + 1}
          onPageChange={(page) => setOffset((page - 1) * LIMIT)}
        />
      </CardContent>
    </Card>
  );
}
