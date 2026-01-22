import { memo, useCallback } from 'react';
import { useAnnotator } from '@annotorious/react';
import type { AnnotoriousOpenSeadragonAnnotator, AnnotationBody, ImageAnnotation, PopupProps, User } from '@annotorious/react';
import { Editor } from './editor';
import type { Room } from '../../../../../types';

import './annotation-popup.css';

export interface AnnotationPopupProps extends PopupProps<ImageAnnotation> {

  me: User;

  readOnly: boolean;

  room: Room;

}

export const AnnotationPopup = memo((props: AnnotationPopupProps) => {

  const { annotation, me, room } = props;

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const onCancel = useCallback(() => {
    anno?.setSelected(undefined);
  }, [anno]);

  const onSave = useCallback((body: Partial<AnnotationBody>, closeAfterSave?: boolean) => {
    if (!anno || !body.id) return;

    const existing = props.annotation.bodies.filter(b => b.id === body.id);
    if (existing.length > 0) {
      const [first, ...rest] = existing;

      if (rest.length > 0)
        props.onDeleteBody(body.id);

      props.onUpdateBody(first, body);
    } else {
      props.onCreateBody(body);
    }

    if (closeAfterSave)
      anno.setSelected(undefined);
  }, [anno, props.annotation]);

  const onDeleteReply = useCallback((reply: AnnotationBody) => {
    if (!anno) return;

    const tombstone: AnnotationBody = {
      id: reply.id,
      annotation: reply.annotation,
      purpose: 'tombstoning',
      created: reply.created, // Time of original reply
      updated: new Date() // Time of deletion
    };

    anno.state.store.updateBody(reply, tombstone);
  }, [anno]);

  return (
    <div 
      className="bg-white border-box rounded-md shadow-lg p-3 w-99 max-h-[80vh] text-sm overflow-y-auto pointer-events-auto">
      <Editor 
        annotation={annotation} 
        me={me} 
        readOnly={props.readOnly}
        room={room}
        onCancel={onCancel}
        onDeleteReply={onDeleteReply}
        onSave={onSave} />
    </div>
  )

}, (prev: AnnotationPopupProps, next: AnnotationPopupProps) => {
  return (JSON.stringify(prev.annotation.bodies) === JSON.stringify(next.annotation.bodies)) && (prev.me.id === next.me.id);
}); 