import React from "react";
import { AuthLayout } from "../../components/layouts/auth-layout";
import { useNavigate } from "react-router";
import { paths } from "../../config/paths";
import { useRegister } from "../../features/auth/api/auth";
import { toast } from "sonner";
import { AuthForm } from "../../components/AuthForm";
const Register: React.FC = () => {
  const registerUser = useRegister();
  const navigate = useNavigate();
  const redirectTo = "/auth/login";

  const handleRegister = async (data: any) => {
    try {
      console.log(data);
      await registerUser.mutateAsync(data);

      toast.success("Đăng ký thành công");
      navigate(`${redirectTo ? `${redirectTo}` : paths.home.getHref()}`, {
        replace: true,
      });
    } catch (err: any) {
      console.log(err);
      toast.error("Đăng ký thất bại");
    }
  };
  return (
    <AuthLayout title="Tạo tài khoản">
      <AuthForm
        mode="register"
        onSubmit={handleRegister}
        isLoading={registerUser.isPending}
      />
    </AuthLayout>
  );
};

export default Register;
