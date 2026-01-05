import { Edit, SimpleForm, TextInput, ImageInput, ImageField, SelectArrayInput, TextArrayField } from "react-admin";

export const UserEdit = () => (
  <Edit>
    <SimpleForm >
      <TextInput source="fullName" label="Full Name"  />
      <TextInput source="email" label="Email"  />
      <TextArrayField source="roles" label="Current Roles"/>
            
      <SelectArrayInput
        source="roles"
        label="Roles"
        choices={[
          { id: "USER", name: "User" },
          { id: "ADMIN", name: "Admin" },
          { id: "MANAGER", name: "Manager" },
        ]}
      />
      <ImageInput source="Avatar" label="Avatar"  accept={{ "image/*": [] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);
