import { useQuery } from "@tanstack/react-query";
import { CategoriesClient } from "../../../web-api-client";

const categoriesClient = new CategoriesClient();

export const getCategories = async () => {
  return await categoriesClient.getCategories();
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
