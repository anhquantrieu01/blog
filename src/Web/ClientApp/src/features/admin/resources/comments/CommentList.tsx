import {
  List,
  Datagrid,
  TextField,
  EditButton,
  TopToolbar,
  CreateButton,
  ImageField,
  DateField,
  DeleteButton
} from "react-admin";

const CommentListActions = () => (
  <TopToolbar>
    <CreateButton />
  </TopToolbar>
);

export const CommentList = () => (
 <List actions={<CommentListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="Id" label="ID" />
      <TextField source="Content" label="Content" />
      <TextField source="AuthorId" label="Author" />
      <TextField source="PostId" label="Post ID" />
      <ImageField source="ThumbnailUrl" label="Thumbnail" />
      <DateField source="CreatedAt" label="Created At" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
