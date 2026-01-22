import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Link, List, Underline } from 'lucide-react';
import { Toggle } from '../../../../../../shadcn/toggle';
import { EditorToolbarLinkDialog } from './editor-toolbar-link-dialog';

interface EditorToolbarProps {

  editor: Editor | null;

}

export const EditorToolbar = (props: EditorToolbarProps) => {

  if (!props.editor) return null;

  const { editor } = props;

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const [linkUrl, setLinkUrl] = useState('');

  const isLinkButtonDisabled = editor.state.selection.empty && !editor.isActive('link');

  const setLink = (url: string) => {
    if (url) {
      // If there's no selection, don't do anything
      if (editor.state.selection.empty)
        return;

      editor
        .chain()
        .focus()
        .setLink({ href: url })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .unsetLink()
        .run();
    }
    setIsLinkDialogOpen(false);
  };

  const handleLinkClick = () => {
    // If text is selected and it's a link, pre-fill the URL
    if (editor.isActive('link')) {
      const attrs = editor.getAttributes('link');
      setLinkUrl(attrs.href || '');
    } else {
      setLinkUrl('');
    }

    setIsLinkDialogOpen(true);
  };

  return (
    <div className="flex gap-1 justify-end items-end">
      <Toggle   
        disabled={isLinkButtonDisabled}
        size="icon"
        className="rounded-sm h-6 w-6"
        pressed={editor.isActive('link')}
        onPressedChange={handleLinkClick}>
        <Link className="h-3 w-3" />
      </Toggle>

      <Toggle 
        size="icon"
        className="rounded-sm h-6 w-6"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-3 w-3" />
      </Toggle>

      <Toggle 
        size="icon"
        className="rounded-sm h-6 w-6"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-3 w-3" />
      </Toggle>

      <Toggle 
        size="icon"
        className="rounded-sm h-6 w-6"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <Italic 
          className="h-3 w-3" />
      </Toggle>

      <Toggle 
        size="icon"
        className="rounded-sm h-6 w-6"
        pressed={editor.isActive('underline')}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline 
          className="h-3 w-3 mt-0.5" />
      </Toggle>

      <EditorToolbarLinkDialog
        open={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        initialUrl={linkUrl}
        onSave={setLink} />
    </div>
  )

}