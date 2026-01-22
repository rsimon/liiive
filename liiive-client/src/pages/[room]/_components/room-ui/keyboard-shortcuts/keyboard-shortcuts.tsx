import { useEffect } from 'react';
import { useRoomUIState } from '../../../_hooks';
import { type AnnotoriousOpenSeadragonAnnotator, useAnnotator } from '@annotorious/react';

export const KeyboardShortcuts = () => {

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const setTool = useRoomUIState(state => state.setTool);

  const isEditorOpen = useRoomUIState(state => state.isEditorOpen);

  const isSearchOpen = useRoomUIState(state => state.isSearchOpen);

  useEffect(() => {
    if (isEditorOpen || isSearchOpen) return;

    const onKeypress = (evt: KeyboardEvent) => {
      if (evt.key === '1')
        setTool('move');
      else if (evt.key === '2')
        setTool('rectangle');
      else if (evt.key === '3')
        setTool('polygon');
      else if (evt.key === '4')
        setTool('ellipse');
      else if (evt.key === '5')
        setTool('path');
      else if (evt.key === '6')
        setTool('intelligent-scissors');
    };

    const onKeydown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        anno.cancelDrawing();
        setTool('move');
      }
    }

    document.addEventListener('keypress', onKeypress);
    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('keypress', onKeypress);
      document.removeEventListener('keydown', onKeydown);
    }
  }, [anno, setTool, isEditorOpen, isSearchOpen]);

  return null;

}