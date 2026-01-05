import { useState } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";

import { useCurrentUser } from "../../features/auth/api/getCurrentUser";
import {
  useUpdateUser,
  useChangePassword,
} from "../../features/users/api/users";
import { UpdateUserCommand, ChangePasswordCommand } from "../../web-api-client";
import { UserForm } from "../../features/admin/pages/users/UserForm";

type MenuKey = "profile" | "password";

export default function Profile() {
  const { data: user, isLoading } = useCurrentUser();
  const updateUser = useUpdateUser();
  const changePassword = useChangePassword(user?.id!);
  const [activeMenu, setActiveMenu] = useState<MenuKey>("profile");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen  p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-5xl"
      >
        <Card className="rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 min-h-[520px]">
            {/* LEFT MENU */}
            <div className="col-span-12 md:col-span-4 border-r  p-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="text-xl">
                    {user.fullName?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-1">
                <Button
                  variant={activeMenu === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveMenu("profile");
                  }}
                >
                  Thông tin hồ sơ
                </Button>

                <Button
                  variant={activeMenu === "password" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveMenu("password")}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </div>

            <div className="col-span-12 md:col-span-8 p-8">
              {activeMenu === "profile" && (
                <div className="space-y-6">
                  <CardHeader className="p-0">
                    <CardTitle>Thông tin hồ sơ</CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 space-y-4">
                    <UserForm
                      defaultValues={{
                        FullName: user.fullName || "",
                        Email: user.email || "",
                        AvatarUrl: user.avatarUrl,
                        AvatarPublicId: user.avatarPublicId,
                      }}
                      isLoading={updateUser.isPending}
                      isEditing={true}
                      isEditingProfile={true}
                      onSubmit={(formData) => {
                        const command = new UpdateUserCommand({
                          id: user.id,
                          fullName: formData.FullName,
                          email: formData.Email,

                          avatarUrl: formData.AvatarUrl,
                          avatarPublicId: formData.AvatarPublicId,
                        });

                        updateUser.mutate(
                          {
                            id: user.id!,
                            data: command,
                          },
                          {
                            onSuccess: () => {
                              toast.success("Cập nhật người dùng thành công");
                            },
                            onError: () => {
                              toast.error("Cập nhật thất bại");
                            },
                          }
                        );
                      }}
                    />
                  </CardContent>
                </div>
              )}

              {activeMenu === "password" && (
                <div className="space-y-6">
                  <CardHeader className="p-0">
                    <CardTitle>Đổi mật khẩu</CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 space-y-4">
                    <UserForm
                      defaultValues={{
                        CurrentPassword: "",
                        NewPassword: "",
                      }}
                      isLoading={changePassword.isPending}
                      isEditing={true}
                      isEditingPassword={true}
                      isEditingProfile={true}
                      onSubmit={(formData) => {
                        const command = new ChangePasswordCommand({
                          id: user.id!,
                          currentPassword: formData.CurrentPassword!,
                          newPassword: formData.NewPassword!,
                        });

                        changePassword.mutate(
                          {
                            data: command,
                          },
                          {
                            onSuccess: () => {
                              toast.success("Cập nhật người dùng thành công");
                            },
                            onError: () => {
                              toast.error("Cập nhật thất bại");
                            },
                          }
                        );
                      }}
                    />
                  </CardContent>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
