import { useCallback, useEffect, useState } from 'react';
import { useAnnotator } from '@annotorious/react';

export const useUndoRedo = () => {

  const [canUndo, setCanUndo] = useState(false);

  const [canRedo, setCanRedo] = useState(false);

  const anno = useAnnotator();

  useEffect(() => {
    if (!anno) return;
    
    const onEvent = () => {
      // Important: stack will only contain real value AFTER
      // the event cycle has finished
      window.setTimeout(() => {
        setCanUndo(anno.canUndo())
        setCanRedo(anno.canRedo());
      }, 10)
    }

    anno.state.store.observe(onEvent);

    return () => {
      anno.state.store.unobserve(onEvent);
    }
  }, [anno]);

  const undo = useCallback(() => {
    anno?.undo();
  }, [anno]);

  const redo = useCallback(() => {
    anno?.redo();
  }, [anno]);

  return { undo, redo, canUndo, canRedo };

}