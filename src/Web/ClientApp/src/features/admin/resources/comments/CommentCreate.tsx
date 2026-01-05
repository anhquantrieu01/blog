import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput, FileInput, FileField } from "react-admin";

export const CommentCreate = () => (
  <Create redirect="list" >
    <SimpleForm>
      
      <TextInput source="Content" multiline />
      
      <ReferenceInput label="Post" source="PostId" reference="posts">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <FileInput source="ThumbnailFile" label="Thumbnail" accept={{ "image/*": [] }}>
        <FileField source="rawFile" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);
