import { useQuery } from "@tanstack/react-query";
import { PostsClient } from "../../../web-api-client";

const postsClient = new PostsClient();

export const getPostBySlug = async (slug: string) => {
  return await postsClient.getPostBySlug(slug);
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["posts", slug],
    queryFn: () => getPostBySlug(slug),
  });
};
