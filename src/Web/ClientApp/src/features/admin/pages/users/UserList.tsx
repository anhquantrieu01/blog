import { useState } from "react";
import { useUsers, useDeleteUser } from "../../../users/api/users";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Link } from "react-router-dom";

export default function UserList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useUsers(page, pageSize);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
    const users = data?.items ?? [];
    console.log(users)
     
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý Users</h1>
        <Button><Link to="/admin/users/create">+ Thêm người dùng</Link></Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.id}
                </TableCell>
                <TableCell className="font-medium">
                  {user.fullName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles?.join(", ")}</TableCell>
                
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Link to={`/admin/users/edit/${user.id}`}>Sửa</Link>
                  </Button>
                  <Button variant="destructive" size="sm" disabled={isDeleting} onClick={() => deleteUser(user.id!)}>
                    Xoá
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          disabled={!data?.hasNextPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
