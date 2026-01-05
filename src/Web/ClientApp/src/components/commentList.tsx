import React from "react";
import { useComments } from "../features/comments/api/comments";
import CommentItem from "./commentItem";

export default function CommentList({ postId }: { postId: number }) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);
  console.log(data)
  if (isLoading) {
    return <p className="text-gray60">Loading comments...</p>;
  }

  const comments =
  data?.pages
    .flatMap((page) => page.items ?? [])
    .filter(Boolean) ?? [];

  if (!comments.length) {
    return <p className="text-gray60">Chưa có bình luận.</p>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment}  postId={postId}/>
      ))}

      {hasNextPage && (
        <div className="pt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-sm text-yellow55 hover:underline disabled:opacity-50"
          >
            {isFetchingNextPage ? "Đang tải..." : "Xem thêm bình luận"}
          </button>
        </div>
      )}
    </div>
  );
}
