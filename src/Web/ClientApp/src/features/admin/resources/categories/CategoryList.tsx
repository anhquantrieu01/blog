import { List, Datagrid, TextField, EditButton } from "react-admin";

export const CategoryList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);