import { useQuery } from "@tanstack/react-query";
import { PostsClient } from "../../../web-api-client";

const postsClient = new PostsClient();

export const getPostById = async (id: number) => {
  return await postsClient.getPostById(id);
};

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(id),
  });
};
