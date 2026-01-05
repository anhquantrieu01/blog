import { Controller, useForm, FormProvider } from "react-hook-form";
import { useUploadImage } from "../features/images/api/images";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

type CommentFormValues = {
  Content: string;
  Id: number;
  ThumbnailUrl?: string;
  ThumbnailPublicId?: string;
  RemoveThumbnail?: boolean;
};

export default function CommentForm({
  defaultValues,
  onSubmit,
  isLoading,
  isEditing = false,
}: {
  defaultValues?: CommentFormValues;
  onSubmit: (data: CommentFormValues) => Promise<void> | void;
  isLoading?: boolean;
  isEditing?: boolean;
}) {
  const uploadImage = useUploadImage();
  const [fileKey, setFileKey] = useState(0);

  const methods = useForm<CommentFormValues>({
    defaultValues: {
      Content: "",
      Id: 0,
      RemoveThumbnail: false,
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const thumbnailUrl = watch("ThumbnailUrl");

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        RemoveThumbnail: false,
      });
      setFileKey((k) => k + 1);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: CommentFormValues) => {
    await onSubmit(data);

    if (!isEditing) {
      reset({
        Content: "",
        Id: 0,
        ThumbnailUrl: undefined,
        ThumbnailPublicId: undefined,
        RemoveThumbnail: false,
      });

      setFileKey((k) => k + 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Input
            className="text-black"
            placeholder="Viết bình luận của bạn"
            {...register("Content", { required: "Bắt buộc" })}
          />
          {errors.Content && (
            <p className="text-sm text-red-500">{errors.Content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Controller
            name="ThumbnailUrl"
            control={control}
            render={() => (
              <Input
                key={fileKey}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const result = await uploadImage.mutateAsync(file);

                  setValue("ThumbnailUrl", result.url, { shouldDirty: true });
                  setValue("ThumbnailPublicId", result.publicId, {
                    shouldDirty: true,
                  });
                  setValue("RemoveThumbnail", false);
                }}
              />
            )}
          />

          {thumbnailUrl && isEditing && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setValue("ThumbnailUrl", undefined);
                  setValue("ThumbnailPublicId", undefined);
                  setValue("RemoveThumbnail", true, {
                    shouldDirty: true,
                  });
                  setFileKey((k) => k + 1);
                }}
              >
                Xóa ảnh
              </Button>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : isEditing ? "Cập nhật" : "Đăng"}
        </Button>
      </form>
    </FormProvider>
  );
}
