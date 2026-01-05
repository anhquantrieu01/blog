import { useQuery } from "@tanstack/react-query";
import { PostsClient } from "../../../web-api-client";

const postsClient = new PostsClient();

export const getLatestPosts = async (take: number = 3) => {
  return await postsClient.getApiPostsLatest(take);
};

export const useLatestPosts = (take: number = 3) => {
  return useQuery({
    queryKey: ["latest-posts", take],
    queryFn: () => getLatestPosts(take),
  });
};
