import { useCallback, useMemo, useEffect, useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import type { AnnotationBody, User } from '@annotorious/core';
import { EditorContent, useEditor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Button } from '../../../../../../shadcn/button';
import { Avatar } from '../../../../../../components/avatar';
import { useRoomUIState, useTrackTyping } from '../../../../_hooks';
import { EditorToolbar } from './editor-toolbar';
import { EditorPrimitiveActions } from './editor-primitive-actions';

const extensions = [
  StarterKit.configure({
    heading: false,
    orderedList: false
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-500 underline hover:text-blue-600'
    }
  }),
  Underline
];

interface EditorPrimitiveProps {

  body: AnnotationBody;

  className?: string;

  initialState?: EditorPrimitiveState;

  me: User;

  onEditing?(): void;

  onCancel?(): void;

  onDelete?(): void;

  onSave?(updated: JSONContent): void;
  
}

export type EditorPrimitiveState = 'read' | 'edit';

export const EditorPrimitive = (props: EditorPrimitiveProps) => {

  const [editorState, setEditorState] = useState<EditorPrimitiveState>(props.initialState || 'read');

  const { isTyping, onKeyDown } = useTrackTyping();

  const setIsTyping = useRoomUIState(state => state.setIsTyping);

  const { canEdit, creator, content, lastEdit, isReply, isDeleted } = useMemo(() => {
    const { body } = props;

    const creator = body.creator!;

    const content: JSONContent | undefined = props.body.value 
      ? JSON.parse(props.body.value) : undefined;

    const isReply = body.purpose === 'replying';

    const isDeleted = body.purpose === 'tombstoning';

    const canEdit = !isDeleted && body.creator?.id === props.me.id;

    const edits = [ body.created!, body.updated!]
      .filter(d => d instanceof Date).sort((a, b) => b.getTime() - a.getTime());

    return { canEdit, creator, content, lastEdit: edits[0] || new Date(), isReply, isDeleted };
  }, [JSON.stringify(props.body)]);

  useEffect(() => {
    if (!props.onEditing) return;

    if (editorState === 'edit' && (props.initialState || 'read') === 'read')
      props.onEditing();
  }, [editorState, props.initialState]);

  const editor = useEditor({ 
    content,
    editable: editorState === 'edit',
    extensions, 
  }, [content, editorState]);

  useEffect(() => {
    editor?.commands.focus();
  }, [editor]);

  useEffect(() => {
    setIsTyping(isTyping);
  }, [isTyping, setIsTyping]);

  useEffect(() => {
    return () => {
      // Clear on unmount
      setIsTyping(false);
    }
  }, [setIsTyping]);

  const onCancel = useCallback(() => {
    setEditorState('read');

    if (props.onCancel)
      props.onCancel();
  }, [editor, props.onCancel]);

  const onSave = useCallback(() => {
    setEditorState('read');
    
    if (editor && props.onSave)
      props.onSave(editor.getJSON());
  }, [editor, props.onSave]);

  const onDelete = useCallback(() => {
    if (editor && props.onDelete)
      props.onDelete();
  }, [editor, props.onDelete]);

  return isDeleted ? (
    <div className="reply w-full pt-3.5 pl-6 pr-3 pb-1 relative">
      <div className="border border-dashed border-gray-300 bg-muted/40 p-2 text-muted-foreground/80 font-light rounded text-xs text-center">Deleted</div>
    </div>
  ) : (
    <div className={clsx(isReply && 'reply pt-3.5 pl-6 relative')}>
      {editorState === 'read' ? (
        <div className="flex justify-between gap-2 pb-2">
          <div className="flex gap-2 items-center">
            <Avatar 
              className="h-6 w-6"
              user={creator} />

            <div className="flex gap-1.5 items-baseline">
              {creator && (
                <div className="font-semibold">
                  {creator.name}
                </div>
              )}
              
              {lastEdit && (
                <>
                  {creator && (
                    <div className="font-semibold">·</div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    {format(lastEdit, 'HH:mm MMM dd')}
                  </div>
                </>
              )}
            </div>
          </div>

          {canEdit && (
            <EditorPrimitiveActions 
              isReply={isReply} 
              onEdit={() => setEditorState('edit')} 
              onDelete={onDelete} />
          )}
        </div>
      ) : (
        <div className="flex justify-between gap-4 pb-2">
          <Avatar 
            className="h-6 w-6"
            user={creator} />

          <EditorToolbar 
            editor={editor} />
        </div>
      )}

      <div
        className={clsx(
          'relative cursor-text rounded-md h-full overflow-y-auto', 
          editorState === 'edit' && 'bg-muted min-h-16 resize-y'
        )}
        onClick={() => editor?.commands.focus()}
        onKeyDown={onKeyDown}>  

        <EditorContent
          className={clsx('h-full w-full leading-relaxed', editorState === 'read' ? 'px-1' : 'p-2')}
          editor={editor} />

        {editorState === 'edit' && (
          <ChevronsUpDown 
            className="absolute bottom-1 right-1 w-4 h-4 text-muted-foreground/40" />
        )}
      </div>

      {editorState === 'edit' && (
        <div className="flex gap-1.5 justify-end pt-3.5 pb-0.5">
          <Button
            className="rounded-full"
            size="sm"
            variant="ghost"
            onClick={onCancel}>
            Cancel
          </Button>

          <Button
            className="rounded-full"
            size="sm"
            onClick={onSave}>
            Save
          </Button>
        </div>
      )}
    </div>
  )

}
