import React from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../components/layouts/auth-layout";
import { AuthForm } from "../../components/AuthForm";
import { useLogin } from "../../features/auth/api/auth";
import { toast } from "sonner";
import { paths } from "../../config/paths";
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const loginUser = useLogin();
const handleLogin = async (data: any) => {
    try {
      console.log(data)
      await loginUser.mutateAsync(data);

      toast.success("Đăng nhập thành công");
      navigate(`${redirectTo ? `${redirectTo}` : paths.home.getHref()}`, {
                  replace: true,
                });
    } catch (err: any) {
      console.log(err)
      toast.error("Đăng nhập thất bại");
    }
  };
  return (
    <AuthLayout title="Đăng Nhập Tài Khoản">
      <AuthForm mode="login"  onSubmit={handleLogin} isLoading={loginUser.isPending}/>
    </AuthLayout>
  );
};

export default Login;
