import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { Placeholder } from '@tiptap/extensions'

import { MenuBar } from "./TiptapMenuBar";

export const CustomImage = Image.extend({
  name: "customImage",
  addAttributes() {
    return {
      ...this.parent?.(),
      publicId: {
        default: null,
        parseHTML: el => el.getAttribute("data-public-id"),
        renderHTML: attrs =>
          attrs.publicId ? { "data-public-id": attrs.publicId } : {},
      },
    };
  },
});

type EditorProps = {
  value: string;
  onChange: (val: string) => void;
  name: string;
};

function TiptapEditor({ value, onChange, name }: EditorProps) {
  const { setValue } = useFormContext();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit,
      CustomImage,
      Placeholder.configure({
        placeholder: "Nội dung bài viết...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      const publicIds: string[] = [];

      editor.getJSON().content?.forEach((node: any) => {
        if (node.type === "customImage" && node.attrs?.publicId) {
          publicIds.push(node.attrs.publicId);
        }
        node.content?.forEach((child: any) => {
          if (child.type === "customImage" && child.attrs?.publicId) {
            publicIds.push(child.attrs.publicId);
          }
        });
      });

      setValue(`${name}PublicIds`, publicIds, {
        shouldDirty: true,
      });
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-3 min-h-[200px]" />
    </div>
  );
}

export function TiptapRHF({ name }: { name: string }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TiptapEditor
          name={name}
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />
  );
}
