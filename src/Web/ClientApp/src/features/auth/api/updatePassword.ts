import { useQueryClient, useMutation } from "@tanstack/react-query";

const updatePassword = async ({
  userId,
  formData,
}: {
  userId: string;
  formData: FormData;
}) => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/Users/${userId}/change-password`,
    {
      method: "PUT",
      body: formData,
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Update failed");
  return await res.json();
}
export const useUpdatePassword = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
