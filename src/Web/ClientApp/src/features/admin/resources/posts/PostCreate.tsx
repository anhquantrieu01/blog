import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  FileInput,
  FileField,
} from "react-admin";
import { TiptapInput } from "../../../../components/TiptapInput";

export const PostCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <TextInput source="Title" />
        <TextInput source="Summary" />
        <TiptapInput source="Content" />

        <ReferenceInput
          label="Category"
          source="CategoryId"
          reference="categories"
        >
          <SelectInput optionText="name" />
        </ReferenceInput>

        <FileInput
          source="ThumbnailFile"
          label="Thumbnail"
          accept={{ "image/*": [] }}
        >
          <FileField source="rawFile" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};
