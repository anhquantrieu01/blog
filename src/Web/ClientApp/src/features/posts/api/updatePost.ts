import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PostsClient, UpdatePostCommand } from "../../../web-api-client";

const postsClient = new PostsClient();

type UpdatePostPayload = {
  id: number;
  command: UpdatePostCommand;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, command }: UpdatePostPayload) =>
      postsClient.updatePost(id, command),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({
        queryKey: ["post", variables.id],
      });
    },
  });
};
