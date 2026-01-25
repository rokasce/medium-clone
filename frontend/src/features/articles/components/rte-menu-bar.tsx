import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Code2Icon,
  LinkIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
} from 'lucide-react';
import { useCallback } from 'react';

interface MenuBarProps {
  editor: Editor | null;
}

export const RichTextEditorMenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-input rounded-t-md">
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        pressed={editor.isActive('bold')}
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        pressed={editor.isActive('italic')}
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        pressed={editor.isActive('underline')}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        pressed={editor.isActive('strike')}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        pressed={editor.isActive('code')}
      >
        <CodeIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        pressed={editor.isActive('codeBlock')}
      >
        <Code2Icon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        pressed={editor.isActive('blockquote')}
      >
        <QuoteIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        pressed={editor.isActive('bulletList')}
      >
        <ListIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        pressed={editor.isActive('orderedList')}
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        pressed={editor.isActive('heading', { level: 1 })}
      >
        <Heading1Icon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        pressed={editor.isActive('heading', { level: 2 })}
      >
        <Heading2Icon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        pressed={editor.isActive('heading', { level: 3 })}
      >
        <Heading3Icon className="h-4 w-4" />
      </Toggle>

      <Button type="button" variant="ghost" size="icon" onClick={setLink}>
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
