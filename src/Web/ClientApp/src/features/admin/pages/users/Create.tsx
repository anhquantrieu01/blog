import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateUser } from "../../../users/api/users";
import { UserForm } from "./UserForm";
const Create = () => {
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const handleCreate = async (data: any) => {
    try {
      console.log(data)
      await createUser.mutateAsync(data);

      toast.success("Tạo người dùng thành công");
      navigate("/admin/users");
    } catch (err: any) {
      console.log(err)
      toast.error("Tạo người dùng thất bại");
    }
  };
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Tạo người dùng</h1>

      <UserForm onSubmit={handleCreate} isLoading={createUser.isPending} />
    </div>
  );
};

export default Create;
