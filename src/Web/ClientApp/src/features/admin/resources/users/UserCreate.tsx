import { Create, SimpleForm, TextInput, ImageInput, ImageField } from "react-admin";

export const UserCreate = () => (
  <Create  redirect="list">
    <SimpleForm >
      <TextInput source="fullName" label="Full Name" />
      <TextInput source="email" label="Email" />
      <TextInput source="password" label="Password" type="password" />
      <ImageInput source="Avatar" label="Avatar" accept={{ "image/*": [] }}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);
