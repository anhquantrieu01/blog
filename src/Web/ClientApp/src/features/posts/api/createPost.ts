import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostsClient, CreatePostCommand } from "../../../web-api-client";

export const createPost = async (data: CreatePostCommand) => {
  const postsClient = new PostsClient();

  return postsClient.createPost(data);
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostCommand) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
