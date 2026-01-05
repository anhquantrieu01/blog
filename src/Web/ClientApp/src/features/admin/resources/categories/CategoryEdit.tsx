import { Edit, SimpleForm, TextInput } from "react-admin";

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="description" required />
    </SimpleForm>
  </Edit>
);