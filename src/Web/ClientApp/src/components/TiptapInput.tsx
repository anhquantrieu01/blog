
import { useInput   } from "react-admin";
import { useFormContext } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";

import {MenuBar} from "./TiptapMenuBar";

import StarterKitImage from '@tiptap/extension-image';

export const CustomImage = StarterKitImage.extend({
  name: 'customImage',
  addAttributes() {
    return {
      ...this.parent?.(),
      publicId: {
        default: null,
        parseHTML: element => element.getAttribute('data-public-id'),
        renderHTML: attributes => {
          if (!attributes.publicId) return {};
          return { 'data-public-id': attributes.publicId };
        },
      },
    };
  },
});

export const TiptapInput = ({ source }: { source: string }) => {
  const {
    field,
    
  } = useInput({ source });
   const { setValue } = useFormContext();

  const editor = useEditor({
    extensions: [StarterKit, TextStyleKit, CustomImage],
    content: field.value || "Nội dung bài viết...",
    onUpdate: ({ editor }) => {
      field.onChange(editor.getHTML()); // update react-admin form
      const publicIds: string[] = [];
      editor.getJSON().content?.forEach((node: any) => {
        if (node.type === "customImage" && node.attrs.publicId) {
          publicIds.push(node.attrs.publicId);
        }
        if (node.content) {
          node.content.forEach((child: any) => {
            if (child.type === "customImage" && child.attrs.publicId) {
              publicIds.push(child.attrs.publicId);
            }
          });
        }
      });
       setValue(`${source}PublicIds`, publicIds);
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <div className="tiptap-editor-wrapper">
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
    </div>
  );
};
