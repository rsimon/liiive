import { useCallback, useEffect, useState } from 'react';
import type { AnnotationBody } from '@annotorious/core';
import { useRoomUIState } from '../../../../_hooks';

export const useTrackOpenPrimitives = () => {

  const setIsEditorOpen = useRoomUIState(state => state.setIsEditorOpen);

  const [openEditorPrimitives, setOpenEditorPrimitives] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsEditorOpen(openEditorPrimitives.size > 0);
  }, [openEditorPrimitives]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      setIsEditorOpen(false);
    }
  }, []);

  const track = useCallback((body: AnnotationBody) => {
    setOpenEditorPrimitives(prev => new Set([...prev, body.id]));
  }, []);

  const untrack = useCallback((body: AnnotationBody) => {
    setOpenEditorPrimitives(prev => {
      const next = new Set(prev);
      next.delete(body.id);
      return next;
    });
  }, []);

  return { track, untrack };

}