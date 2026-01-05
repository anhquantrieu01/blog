import { Controller, useForm, FormProvider } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useCategories } from "../../../categories/api/getCategories";
import { useUploadImage } from "../../../images/api/images";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { TiptapRHF } from "../../../../components/TiptapRHF";

type PostFormValues = {
  Title: string;
  Summary: string;
  Content: string;
  CategoryId: number;
  ThumbnailUrl?: string;
  ThumbnailPublicId?: string;
};

export function PostForm({
  defaultValues,
  onSubmit,
  isLoading,
}: {
  defaultValues?: PostFormValues;
  onSubmit: (data: PostFormValues) => void;
  isLoading?: boolean;
}) {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const uploadImage = useUploadImage();

  const methods = useForm<PostFormValues>({
    defaultValues,
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
        {/* Title */}
        <div>
          <Input
            placeholder="Tiêu đề"
            {...register("Title", { required: "Bắt buộc" })}
          />
          {errors.Title && (
            <p className="text-sm text-red-500">{errors.Title.message}</p>
          )}
        </div>

        {/* Summary */}
        <div>
          <Input
            placeholder="Tóm tắt"
            {...register("Summary", { required: "Bắt buộc" })}
          />
          {errors.Summary && (
            <p className="text-sm text-red-500">{errors.Summary.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <TiptapRHF name="Content" />
          {errors.Content && (
            <p className="text-sm text-red-500">{errors.Content.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <Controller
            name="CategoryId"
            control={control}
            rules={{ required: "Chọn danh mục" }}
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                onValueChange={(v) => field.onChange(Number(v))}
                disabled={isCategoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    ?.filter((c) => c.id !== undefined && c.name)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id!.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.CategoryId && (
            <p className="text-sm text-red-500">
              {errors.CategoryId.message}
            </p>
          )}
        </div>

        {/* Thumbnail */}
        <div className="space-y-2">
          <Controller
            name="ThumbnailUrl"
            control={control}
            render={() => (
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const result = await uploadImage.mutateAsync(file);

                  setValue("ThumbnailUrl", result.url, {
                    shouldDirty: true,
                  });
                  setValue("ThumbnailPublicId", result.publicId, {
                    shouldDirty: true,
                  });
                }}
              />
            )}
          />

          {(watch("ThumbnailUrl") || defaultValues?.ThumbnailUrl) && (
            <img
              src={watch("ThumbnailUrl") || defaultValues?.ThumbnailUrl}
              alt="Thumbnail"
              className="w-40 rounded-md border"
            />
          )}
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu"}
        </Button>
      </form>
    </FormProvider>
  );
}
