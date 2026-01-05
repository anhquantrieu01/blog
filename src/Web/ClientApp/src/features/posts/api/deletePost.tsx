import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostsClient } from "../../../web-api-client";

const postsClient = new PostsClient();

export const deletePost = async (postId: number) => {
  if (!postId) throw new Error("PostId is required");

  return postsClient.deletePost(postId);
};
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

  });
};