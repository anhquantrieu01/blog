import { Controller, useForm, FormProvider } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useUploadImage } from "../../../images/api/images";
import { ROLES, RoleTypes, PasswordRules } from "../../../../lib/authorization";

type UserFormValues = {
  FullName?: string;
  Email?: string;
  Password?: string;
  CurrentPassword?: string;
  NewPassword?: string;
  Roles?: RoleTypes[];
  AvatarUrl?: string;
  AvatarPublicId?: string;
};

export function UserForm({
  defaultValues,
  onSubmit,
  isLoading,
  isEditing,
  isEditingProfile,
  isEditingPassword,
}: {
  defaultValues?: UserFormValues;
  onSubmit: (data: UserFormValues) => void;
  isLoading?: boolean;
  isEditing?: boolean;
  isEditingPassword?: boolean;
  isEditingProfile?: boolean;
}) {
  const uploadImage = useUploadImage();
  const ALL_ROLES = Object.values(ROLES);
  const methods = useForm<UserFormValues>({
    defaultValues: {
      ...defaultValues,
      Roles: defaultValues?.Roles ?? [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isEditingPassword && (
        <div>
          <Input
            className={isEditingProfile ? "bg-dark10" : ""}
            placeholder="Họ và tên"
            {...register("FullName", { required: "Bắt buộc" })}
          />
          {errors.FullName && (
            <p className="text-sm text-red-500">{errors.FullName.message}</p>
          )}
        </div>
        )}
        {!isEditing && (
          <div>
            <Input
              placeholder="Mật khẩu"
              {...register("Password", PasswordRules)}
            />
            {errors.Password && (
              <p className="text-sm text-red-500">{errors.Password.message}</p>
            )}
          </div>
        )}

        {isEditingPassword && (
          <>
            <div>
              <Input
                className={isEditingProfile ? "bg-dark10" : ""}
                placeholder="Mật khẩu hiện tại"
                {...register("CurrentPassword", { required: "Bắt buộc" })}
              />
              {errors.CurrentPassword && (
                <p className="text-sm text-red-500">
                  {errors.CurrentPassword.message}
                </p>
              )}
            </div>

            <div>
              <Input
                className={isEditingProfile ? "bg-dark10" : ""}
                placeholder="Mật khẩu mới"
                {...register("NewPassword", PasswordRules)}
              />
              {errors.NewPassword && (
                <p className="text-sm text-red-500">
                  {errors.NewPassword.message}
                </p>
              )}
            </div>
          </>
        )}
        {!isEditingPassword && (
        <div className="space-y-2">
          <Controller
            name="AvatarUrl"
            control={control}
            render={() => (
              <Input
               className={isEditingProfile ? "text-white" : ""}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const result = await uploadImage.mutateAsync(file);

                  setValue("AvatarUrl", result.url, {
                    shouldDirty: true,
                  });
                  setValue("AvatarPublicId", result.publicId, {
                    shouldDirty: true,
                  });
                }}
              />
            )}
          />

          {(watch("AvatarUrl") || defaultValues?.AvatarUrl) && (
            <img
              src={watch("AvatarUrl") || defaultValues?.AvatarUrl}
              alt="Avatar"
              className="w-40 rounded-md border"
            />
          )}
        </div>
        )}
        {isEditing &&
          defaultValues?.Roles?.includes(ROLES.ADMIN || ROLES.MANAGER) && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Roles</p>

              {ALL_ROLES.map((role) => (
                <label key={role} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={role}
                    {...register("Roles")}
                    defaultChecked={defaultValues?.Roles?.includes(role)}
                  />
                  {role}
                </label>
              ))}
            </div>
          )}
        <Button
          className={isEditingProfile ? "text-white" : ""}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Đang lưu..." : "Lưu"}
        </Button>
      </form>
    </FormProvider>
  );
}
