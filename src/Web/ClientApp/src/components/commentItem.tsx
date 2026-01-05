import React, { useState } from "react";
import { toast } from "sonner";
import {
  useUpdateComment,
  useDeleteComment,
} from "../features/comments/api/comments";
import { useCurrentUser } from "../features/auth/api/getCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { UpdateCommentCommand } from "../web-api-client";

import CommentForm from "./commentForm";
interface CommentItemProps {
  comment: any;
  postId: number;
}

export default function CommentItem({ comment, postId }: CommentItemProps) {
  const { data: user } = useCurrentUser();

  const isAuthor = user?.id === comment.authorId;

  const updateMutation = useUpdateComment(postId);
  const deleteMutation = useDeleteComment(postId);

  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(comment.id);
  };

  return (
    <div className="flex gap-4">
      <Avatar className="w-10 h-10 shrink-0">
        {comment.authorAvatarUrl ? (
          <AvatarImage
            src={comment.authorAvatarUrl}
            alt={comment.authorName ?? "User"}
          />
        ) : (
          <AvatarFallback>
            {comment.authorName?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className=" p-2 flex  items-center gap-x-2 text-gray50">
          <span className="font-semibold text-gray90 ">
            {comment.authorName ?? "User"}
          </span>
          <span className="text-xs">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="bg-dark15 rounded-xl p-4 space-y-2">
          {!isEditing ? (
            <p className="text-gray90 text-sm whitespace-pre-line">
              {comment.content}
            </p>
          ) : (
            <>
              <CommentForm
                defaultValues={{
                  Id: comment.id,
                  Content: comment.content || "",
                  ThumbnailUrl: comment.thumbnailUrl,
                  ThumbnailPublicId: comment.thumbnailPublicId,
                }}
                isLoading={updateMutation.isPending}
                isEditing={isEditing}
                onSubmit={(formData) => {
                  const command = new UpdateCommentCommand({
                    id: comment.id,
                    content: formData.Content,
                    thumbnailUrl: formData.ThumbnailUrl,
                    thumbnailPublicId: formData.ThumbnailPublicId,
                    removeThumbnail: formData.RemoveThumbnail,

                  });
                  console.log("command", command);
                  updateMutation.mutate(
                    {
                      id: comment.id,
                      data: command,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Đã gửi");
                        setIsEditing(false);
                      },
                      onError: () => {
                        toast.error("Cập nhật thất bại");
                        setIsEditing(false);
                      },
                    }
                  );
                }}
              />
            </>
          )}

          {comment.thumbnailUrl && (
            <div className="relative w-fit">
              <img
                src={comment.thumbnailUrl}
                alt="comment"
                className="w-40 rounded-lg"
              />
            </div>
          )}

          {isAuthor && (
            <div className="flex gap-4 text-xs text-gray60 pt-1">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="hover:text-yellow55 transition"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={handleDelete}
                    className="hover:text-red-400 transition"
                  >
                    Xóa
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
