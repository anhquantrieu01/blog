import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteButton,
  ImageField,
  TextArrayField
} from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="username" />
      <EmailField source="email" />
      <ImageField source="avatarUrl" label="Avatar" />
      <TextArrayField source="roles" label="Roles"/>
      
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
