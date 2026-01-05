import simpleRestProvider from "ra-data-simple-rest";

const apiUrl = process.env.REACT_APP_API_URL!;
const dataProvider = simpleRestProvider(apiUrl);

// Chuyển dữ liệu thành FormData (file + fields)
const toFormData = (data: any) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]: any) => {
    if (value?.rawFile) {
      formData.append(key, value.rawFile);
    } else if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // chuyển mảng thành string JSON
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

const customDataProvider = {
  ...dataProvider,
    getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const filter = params.filter ?? {};

    if (resource === "posts") {
      const query = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: perPage.toString(),
        sort: "Newest",
      });

      const res = await fetch(`${apiUrl}/posts?${query}`);
      const json = await res.json();

      return {
        data: json.items.map((x: any) => ({ ...x, id: x.id })),
        total: json.totalCount,
      };
    }

    if (resource === "comments") {
      const postId = filter.postId;

      if (!postId) {
       
        return { data: [], total: 0 };
      }

      const query = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: perPage.toString(),
      });

      const res = await fetch(
        `${apiUrl}/comments/post/${postId}?${query}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      const json = await res.json();

      return {
        data: json.items.map((x: any) => ({
          ...x,
          id: x.id,
        })),
        total: json.totalCount,
      };
    }

    return dataProvider.getList(resource, params);
  },

  create: async (resource: string, params: any) => {
    if (
      resource === "posts" ||
      resource === "users" ||
      resource === "comments"
    ) {
      const formData = toFormData(params.data);

      const res = await fetch(`${apiUrl}/${resource}`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      return { data: json.data };
    }

    return dataProvider.create(resource, params);
  },

  update: async (resource: string, params: any) => {
    if (
      resource === "posts" ||
      resource === "users" ||
      resource === "comments"
    ) {
      const formData = toFormData(params.data);

      const res = await fetch(`${apiUrl}/${resource}/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      const json = await res.json();
      return { data: json.data };
    }

    return dataProvider.update(resource, params);
  },
};

export default customDataProvider;
