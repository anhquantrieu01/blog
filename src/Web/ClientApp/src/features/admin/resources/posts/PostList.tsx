import {
  List,
  Datagrid,
  TextField,
  EditButton,
  TopToolbar,
  CreateButton,
  ImageField,
  ReferenceField,
} from "react-admin";

const PostListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

export const PostList = () => (
  <List actions={<PostListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="summary" />
      <ImageField source="thumbnailUrl" label="Thumbnail" />
      <ReferenceField
        label="Category"
        source="categoryId"
        reference="categories"
      >
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);
