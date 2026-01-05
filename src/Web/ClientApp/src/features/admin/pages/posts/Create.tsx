import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreatePost } from "../../../posts/api/createPost";
import { PostForm } from "./PostForm";
const Create = () => {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const handleCreate = async (data: any) => {
    try {
      console.log(data)
      await createPost.mutateAsync(data);

      toast.success("Tạo bài viết thành công");
      navigate("/admin/posts");
    } catch (err: any) {
      console.log(err)
      toast.error("Tạo bài viết thất bại");
    }
  };
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Tạo bài viết</h1>

      <PostForm onSubmit={handleCreate} isLoading={createPost.isPending} />
    </div>
  );
};

export default Create;
