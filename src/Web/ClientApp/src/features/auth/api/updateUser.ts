import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateUser = async ({
  userId,
  formData,
}: {
  userId: string;
  formData: FormData;
}) => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/Users/${userId}`,
    {
      method: "PUT",
      body: formData,
      credentials: "include",
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Update failed");
  }

  return res.json();
};

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // 🔥 CỰC KỲ QUAN TRỌNG
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
