import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  FileInput,
  FileField,
} from "react-admin";
import { TiptapInput } from "../../../../components/TiptapInput";
export const PostEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="title" />
        <TextInput source="summary" />
        <TiptapInput source="content" />

        <ReferenceInput
          label="Category"
          source="categoryId"
          reference="categories"
        >
          <SelectInput optionText="name" />
        </ReferenceInput>

        <FileInput
          source="thumbnailFile"
          label="Thumbnail"
          accept={{ "image/*": [] }}
          placeholder={<p>Drop your file here</p>}
        >
          <FileField source="rawFile" title="title" />
        </FileInput>
      </SimpleForm>
    </Edit>
  );
};
