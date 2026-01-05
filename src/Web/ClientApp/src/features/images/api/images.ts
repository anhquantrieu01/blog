import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagesClient, ImageUploadResultDto, FileParameter, UploadsClient  } from "../../../web-api-client";

const imagesClient = new ImagesClient();
const uploadsClient = new UploadsClient();

export const uploadImage = (file: File): Promise<ImageUploadResultDto> => {
  const fileParameter: FileParameter = {
    data: file,
    fileName: file.name,
  };
  return imagesClient.uploadImage(fileParameter);
};

export const uploadContentImage = (file: File): Promise<ImageUploadResultDto> => {
  const fileParameter: FileParameter = {
    data: file,
    fileName: file.name,
  };
  return uploadsClient.uploadFile(fileParameter);
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
};
export const useUploadContentImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadContentImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
};

