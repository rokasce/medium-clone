import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Heading } from '@tiptap/extension-heading';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
}

export const useRichTextEditor = ({
  content,
  onChange,
  onBlur,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        link: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onBlur,
    editorProps: {
      attributes: {
        class: 'tiptap min-h-[200px] w-full',
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.isEmpty) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return editor;
};
