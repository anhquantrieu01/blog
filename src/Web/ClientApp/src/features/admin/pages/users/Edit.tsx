import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "../../../../components/ui/skeleton";
import { UserForm } from "./UserForm";
import { useGetUserById, useUpdateUser } from "../../../users/api/users";
import { toast } from "sonner";
import { UpdateUserCommand } from "../../../../web-api-client";
import { RoleTypes } from "../../../../lib/authorization";
const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading } = useGetUserById(id!);
  const updateUser = useUpdateUser();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-red-500">Không tìm thấy người dùng</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">✏️ Chỉnh sửa người dùng</h1>

      <UserForm
        defaultValues={{
          FullName: user.fullName || "",
          Email: user.email || "",
          Roles: user.roles as RoleTypes[] || [],
          AvatarUrl: user.avatarUrl,
          AvatarPublicId: user.avatarPublicId,
        }}
        isLoading={updateUser.isPending}
        isEditing={true}
        onSubmit={(formData) => {
          const command = new UpdateUserCommand({
            id: id,
            fullName: formData.FullName,
            email: formData.Email,
            roles: formData.Roles,
            avatarUrl: formData.AvatarUrl,
            avatarPublicId: formData.AvatarPublicId,
          });

          updateUser.mutate(
            {
              id: id!,
              data: command,
            },
            {
              onSuccess: () => {
                toast.success("Cập nhật người dùng thành công");
                navigate("/admin/users");
              },
              onError: () => {
                toast.error("Cập nhật thất bại");
              },
            }
          );
        }}
      />
    </div>
  );
};

export default Edit;
