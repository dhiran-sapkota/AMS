import { TableCell, TableRow } from "@/components/ui/table";
import { DATE_FORMAT, genderMap, roleMap } from "@/data/constant";
import { TUser } from "@/types";
import dayjs from "dayjs";
import EditUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";

type props = {
  user: TUser;
  index : number
  offset: number;
};

const UserRow = ({ user, index, offset }: props) => {
  return (
    <TableRow>
      <TableCell>{offset + (++index)}</TableCell>
      <TableCell>
        {user.first_name} {user.last_name}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{dayjs(user.dob).format(DATE_FORMAT)}</TableCell>
      <TableCell>{genderMap.get(user.gender)}</TableCell>
      <TableCell>{user.address}</TableCell>
      <TableCell>{roleMap.get(user.role)}</TableCell>
      <TableCell className=" flex gap-1">
        <EditUser
          userData={user}
          key={"Edit"}
          header="Edit User"
          title="Edit User"
        />
        <DeleteUser  user={user} />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
