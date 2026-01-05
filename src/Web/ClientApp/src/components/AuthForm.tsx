import { useForm, FormProvider } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PasswordRules } from "../lib/authorization";
import { Link } from "react-router-dom";

type AuthMode = "login" | "register";

type AuthFormValues = {
  FullName?: string;
  Email: string;
  Password: string;
  ConfirmPassword?: string;
};
export function AuthForm({
  mode,
  onSubmit,
  isLoading,
}: {
  mode: AuthMode;
  onSubmit: (data: AuthFormValues) => void;
  isLoading?: boolean;
}) {
  const methods = useForm<AuthFormValues>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const password = watch("Password");

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 shadow"
      >
        <h1 className="text-center text-2xl font-semibold">
          {mode === "login" ? "Đăng nhập" : "Đăng ký"}
        </h1>
        {mode === "register" && (
          <div>
            <Input
              type="text"
              placeholder="Tên"
              {...register("FullName", {
                required: "Bắt buộc",
              })}
            />
            {errors.FullName && (
              <p className="text-sm text-red-500">{errors.FullName.message}</p>
            )}
          </div>
        )}

        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register("Email", {
              required: "Bắt buộc",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email không hợp lệ",
              },
            })}
          />
          {errors.Email && (
            <p className="text-sm text-red-500">{errors.Email.message}</p>
          )}
        </div>

       =
        <div>
          <Input
            type="password"
            placeholder="Mật khẩu"
            {...register("Password", PasswordRules)}
          />
          {errors.Password && (
            <p className="text-sm text-red-500">{errors.Password.message}</p>
          )}
        </div>

        {mode === "register" && (
          <div>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu"
              {...register("ConfirmPassword", {
                required: "Bắt buộc",
                validate: (v) => v === password || "Mật khẩu không khớp",
              })}
            />
            {errors.ConfirmPassword && (
              <p className="text-sm text-red-500">
                {errors.ConfirmPassword.message}
              </p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Đang xử lý..."
            : mode === "login"
            ? "Đăng nhập"
            : "Đăng ký"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <Link
            to={mode === "login" ? "/auth/register" : "/auth/login"}
            className="font-medium text-primary hover:underline"
          >
            {mode === "login" ? "Đăng ký" : "Đăng nhập"}
          </Link>
        </p>
      </form>
    </FormProvider>
  );
}
