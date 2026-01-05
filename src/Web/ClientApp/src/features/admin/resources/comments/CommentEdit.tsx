import { Edit, SimpleForm, TextInput, NumberInput, ImageInput, ImageField } from "react-admin";

export const CommentEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="Content" label="Content" />
      <NumberInput source="PostId" label="Post ID" />
      <TextInput source="AuthorId" label="Author ID" />
      <ImageInput source="ThumbnailFile" label="Thumbnail" accept={{ "image/*": [] }} placeholder={<p>Drop your file here</p>}>
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);
