import { useState } from "react";
import { usePosts } from "../../../posts/api/getPosts";
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
import { useDeletePost } from "../../../../features/posts/api/deletePost";

export default function PostList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = usePosts(page, pageSize);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
    const posts = data?.items ?? [];

     
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý bài viết</h1>
        <Button><Link to="/admin/posts/create">+ Thêm bài viết</Link></Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Ngày tạo</TableHead>
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

            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  {post.title}
                </TableCell>
                <TableCell>{post.categoryName}</TableCell>
                <TableCell>
                 {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Link to={`/admin/posts/edit/${post.id}`}>Sửa</Link>
                  </Button>
                  <Button variant="destructive" size="sm" disabled={isDeleting} onClick={() => deletePost(post.id!)}>
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
