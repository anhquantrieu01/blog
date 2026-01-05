import { Admin, Resource } from "react-admin";
import { QueryClient } from "@tanstack/react-query";
import customDataProvider from "../providers/dataProvider";
import { PostList, PostEdit, PostCreate } from "../resources/posts";
import {
  CategoryList,
  CategoryEdit,
  CategoryCreate,
} from "../resources/categories";
import { UserList, UserEdit, UserCreate } from "../resources/users";
import { CommentList, CommentEdit, CommentCreate } from "../resources/comments";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: true,
    },
  },
});
export const AdminApp = () => {
  
  return (
    <Admin basename="/admin" dataProvider={customDataProvider} queryClient={queryClient}>
      <Resource
        name="posts"
        list={PostList}
        edit={PostEdit}
        create={PostCreate}
      />
      <Resource
        name="categories"
        list={CategoryList}
        edit={CategoryEdit}
        create={CategoryCreate}
      />
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
      />
      <Resource
        name="comments"
        list={CommentList}
        edit={CommentEdit}
        create={CommentCreate}
      />
    </Admin>
  );
};

export default AdminApp;
