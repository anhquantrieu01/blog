import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  UsersClient,
  UpdateUserCommand,
  CreateUserCommand,
  ChangePasswordCommand,
} from "../../../web-api-client";

const usersClient = new UsersClient();
type UpdateUserPayload = {
  id: string;
  data: UpdateUserCommand;
};
export const getUsers = async ({
  page,
  pageSize = 9,
}: {
  page: number;
  pageSize?: number;
}) => {
  return await usersClient.getAllUsers(page, pageSize);
};

export const useUsers = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => getUsers({ page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};



export const createUser = async (data: CreateUserCommand) => {
  return usersClient.createUser(data);
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserPayload) =>
      usersClient.updateUser(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["user", variables.id],
      });
    },
  });
};

export const changePassword = async (userId: string, data: ChangePasswordCommand) => {
  if (!userId) throw new Error("userId is required");

  return usersClient.changePassword(userId, data);
};

export const deleteUser = async (userId: string) => {
  if (!userId) throw new Error("userId is required");

  return usersClient.deleteUser(userId);
};
export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};


export const useChangePassword = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({data}: {data: ChangePasswordCommand}) => changePassword(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserCommand) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersClient.getUserById(userId),
  });
};
