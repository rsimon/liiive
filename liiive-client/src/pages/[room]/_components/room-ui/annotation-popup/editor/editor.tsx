import { useCallback, useEffect, useMemo, useState } from 'react';
import { Reply } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { AnnotationBody, User } from '@annotorious/core';
import { useAnnotator } from '@annotorious/react';
import type { AnnotoriousOpenSeadragonAnnotator, ImageAnnotation } from '@annotorious/react';
import type { JSONContent } from '@tiptap/react';
import { Button } from '../../../../../../shadcn/button';
import { EditorPrimitive } from './editor-primitive';
import { useTrackOpenPrimitives } from './use-track-open-primitives';
import { Avatar } from '../../../../../../components/avatar';
import { TypingAnimation } from './typing-animation';
import type { Room } from '../../../../../../types';

interface EditorProps {

  annotation: ImageAnnotation;

  me: User;

  readOnly: boolean;

  room: Room;

  onCancel(): void;

  onDeleteReply(reply: AnnotationBody): void;

  onSave(updated: Partial<AnnotationBody>, closeAfterSave?: boolean): void;
  
}

export const Editor = (props: EditorProps) => { 

  const { annotation } = props;

  const isMine = annotation.target.creator?.id === props.me.id;

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const { track, untrack } = useTrackOpenPrimitives();

  const { comment, replies } = useMemo(() => {
    const comment = annotation.bodies
      .find(b => b.purpose === 'commenting' || !b.purpose);

    const replies = annotation.bodies
      .filter(b => b.purpose === 'replying' || b.purpose === 'tombstoning')
      .sort((a, b) => (b.created && a.created) ? a.created.getTime() - b.created.getTime() : 0);

    return { comment, replies };
  }, [annotation]);

  const [pendingBody, setPendingBody] = useState<AnnotationBody | undefined>();

  useEffect(() => {
    if (!comment && isMine) {
      const initialComment = {
        id: uuidv4(),
        annotation: annotation.id,
        purpose: 'commenting',
        creator: props.me
      };
      
      track(initialComment);
      setPendingBody(initialComment);
    } else {
      setPendingBody(undefined);
    }
  }, [JSON.stringify(comment), annotation.id, isMine, props.me]);

  const onCancelInitial = useCallback(() => {
    if (!pendingBody) return;

    anno.removeAnnotation(annotation);
    untrack(pendingBody);
    props.onCancel();
  }, [annotation, anno, pendingBody, props.onCancel]);

  const onCancel = useCallback((body: AnnotationBody) => () => {
    untrack(body);
    setPendingBody(undefined);
  }, []);

  const onSave = useCallback((body: AnnotationBody, closeAfterSave?: boolean) => (content: JSONContent) => {
    props.onSave({
      ...body,
      value: JSON.stringify(content)
    }, closeAfterSave);

    untrack(body);
  }, [props.onSave]);

  const onDeleteAnnotation = useCallback(() => {
    anno.removeAnnotation(annotation);
  }, [anno, annotation]);

  const onDeleteReply = useCallback((reply: AnnotationBody) => () => {
    props.onDeleteReply(reply);
    untrack(reply);
  }, []);

  const onAddReply = useCallback(() => {
    const reply = {
      id: uuidv4(),
      annotation: annotation.id,
      purpose: 'replying',
      creator: props.me
    };
    
    track(reply);
    setPendingBody(reply);
  }, [annotation.id, props.me]);

  return comment ? (
    <div>
      <EditorPrimitive 
        body={comment}
        me={props.me} 
        onEditing={() => track(comment)}
        onCancel={onCancel(comment)}
        onDelete={onDeleteAnnotation}
        onSave={onSave(comment)} />

      <div>
        {replies.map(reply => (
          <EditorPrimitive
            key={reply.id}
            body={reply}
            me={props.me}
            onEditing={() => track(reply)}
            onCancel={onCancel(reply)}
            onDelete={onDeleteReply(reply)}
            onSave={onSave(reply)} />
        ))}

        {(pendingBody?.purpose === 'replying') && (
          <EditorPrimitive
            initialState="edit"
            body={pendingBody}
            me={props.me}
            onCancel={onCancel(pendingBody)}
            onSave={onSave(pendingBody, true)} />
        )}
      </div>

      {!pendingBody && !props.readOnly && (
        <div>
          <Button
            className="text-muted-foreground gap-1 h-6 pt-6 text-xs pl-1"
            variant="link"
            onClick={onAddReply}>
            <Reply 
              className="mb-0.5" 
              strokeWidth={1.7} /> Reply
            </Button>
        </div>
      )}
    </div>
  ) : pendingBody ? (
    <EditorPrimitive
      initialState="edit"
      body={pendingBody} 
      me={props.me}
      onCancel={onCancelInitial} 
      onSave={onSave(pendingBody, true)} />
  ) : (
    <div className="flex gap-3 items-center">
      <Avatar user={annotation.target.creator!} />
      <TypingAnimation />
    </div>
  );

}
