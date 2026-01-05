import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "../../../../components/ui/skeleton";
import { PostForm } from "./PostForm";
import { usePost } from "../../../posts/api/getPostById";
import { useUpdatePost } from "../../../posts/api/updatePost";
import { toast } from "sonner";
import { UpdatePostCommand } from "../../../../web-api-client";

const Edit = () => {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();

  const { data: post, isLoading } = usePost(postId!);
  const updatePost = useUpdatePost();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!post) {
    return <p className="text-red-500">Không tìm thấy bài viết</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">✏️ Chỉnh sửa bài viết</h1>

      <PostForm
        defaultValues={{
          Title: post.title || "",
          Summary: post.summary || "",
          Content: post.content || "",
          CategoryId: post.categoryId || 0,
          ThumbnailUrl: post.thumbnailUrl,
          ThumbnailPublicId: post.thumbnailPublicId,
        }}
        isLoading={updatePost.isPending}
        onSubmit={(formData) => {
          const command = new UpdatePostCommand({
            id: postId,
            title: formData.Title,
            summary: formData.Summary,
            content: formData.Content,
            categoryId: formData.CategoryId,
            thumbnailUrl: formData.ThumbnailUrl,
            thumbnailPublicId: formData.ThumbnailPublicId,
          });

          updatePost.mutate(
            {
              id: postId,
              command,
            },
            {
              onSuccess: () => {
                toast.success("Cập nhật bài viết thành công");
                navigate("/admin/posts");
              },
              onError: () => {
                toast.error("Cập nhật thất bại");
              },
            }
          );
        }}
      />
    </div>
  );
};

export default Edit;
