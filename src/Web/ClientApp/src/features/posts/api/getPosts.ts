import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { PostsClient, PostSort } from "../../../web-api-client";

const postsClient = new PostsClient();

export const getPosts = async ({
  page,
  pageSize = 9,
  search,
  categoryId,
  sort,
}: { 
  page: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  sort?: PostSort;
}) => {
  return await postsClient.getPosts(page,
    pageSize,
    search,
    categoryId,
    sort);
};

export const usePosts = (page: number,pageSize: number,
  search?: string,
  categoryId?: number,
  sort?: PostSort) => {
  return useQuery({
    queryKey: ["posts",  page, pageSize, categoryId, sort, search],
    queryFn: () => getPosts({ page, pageSize, categoryId, sort, search }),
     placeholderData: keepPreviousData,
     staleTime: 1000 * 30,
  });
};