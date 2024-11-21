import { useQuery } from "react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUsers } from "@/service/api/user";
import UserRow from "./components/UserRow";
import AddUser from "./components/AddUser";
import { LIMIT, QUERY_KEYS } from "@/data/constant";
import CustomPagination from "@/components/Pagination";
import { useState } from "react";
import TableWrapper from "@/components/TableWrapper";

export default function UserListingPage() {
  const [offset, setOffset] = useState(0);
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER, offset],
    queryFn: () => fetchUsers({ limit: LIMIT, offset: offset }),
  });

  const headers = ["S.No", "Name", "Email", "Phone", "Date of Birth", "Gender", "Address", "Role", "Actions"];
  if (error) return <div>An error has occurred</div>;

  return (
    <Card className="h-full flex flex-col ">
      <CardHeader className=" flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
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
