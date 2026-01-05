import React from "react";
import { toast } from "sonner";
import { useCreateComment } from "../features/comments/api/comments";
import CommentForm from "./commentForm";
import CommentList from "./commentList";
interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
    const createComment = useCreateComment();
    const handleCreate = async (data: any) => {
      try {
        const form = {
          ...data,
          PostId: postId
        }
        console.log("data", form);
        await createComment.mutateAsync(form);
  
        toast.success("Đã gửi");
      } catch (err: any) {
        console.log(err)
        toast.error("Có lỗi khi gửi");
      }
    };


  if (!postId) return null;
  return (
    <section className="mt-20 border-t border-gray70 pt-10">
      <h2 className="text-xl font-semibold text-white mb-6 mt-6">
        Bình luận
      </h2>

      <CommentForm onSubmit={handleCreate} isLoading={createComment.isPending} />
      <CommentList postId={postId} />
    </section>
  );
}
