import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentsClient, PaginatedListOfCommentDto, CreateCommentCommand, UpdateCommentCommand  } from "../../../web-api-client";

const commentsClient = new CommentsClient();

export const getCommentsByPostId = async (
  postId: number,
  pageNumber: number,
  pageSize = 5
): Promise<PaginatedListOfCommentDto> => {
  return commentsClient.getCommentsByPostId(postId, pageNumber, pageSize);
};

export const createComment = async (data: CreateCommentCommand) => {
  return await commentsClient.createComment(data)
};

export const updateComment = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateCommentCommand;
}) => {
  return await commentsClient.updateComment(id, data)
};


export const deleteComment = async (id: number) => {
  return await commentsClient.deleteComment(id);
};

export const useComments = (postId: number, pageSize = 5) => {
  return useInfiniteQuery({
  queryKey: ["comments", postId],
  enabled: !!postId,

  initialPageParam: 1,

  queryFn: ({ pageParam }) =>
    getCommentsByPostId(postId, pageParam, pageSize),

  getNextPageParam: (lastPage) => {
    if (!lastPage.pageNumber || !lastPage.totalPages) return undefined;

    return lastPage.pageNumber < lastPage.totalPages
      ? lastPage.pageNumber + 1
      : undefined;
  },
});
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentCommand) => createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export const useUpdateComment = (postId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};

export const useDeleteComment = (postId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};
