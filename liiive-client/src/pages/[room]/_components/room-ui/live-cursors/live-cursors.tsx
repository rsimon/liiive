import { useEffect, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { useViewer } from '../../../_hooks';
import type { Cursor } from '../../../../../types';
import { Cursor as CursorIcon } from './cursor';

interface LiveCursorsProps {

  cursors: Cursor[];

}

export const LiveCursors = (props: LiveCursorsProps) => {

  const viewer = useViewer(state => state.viewer);

  const [viewportCursors, setViewportCursors] = useState<Cursor[]>([]);

  useEffect(() => {
    if (!viewer?.element) return;

    const toViewportCoordinates = (point: number[]) => {
      const xy = viewer.viewport.imageToViewerElementCoordinates(new OpenSeadragon.Point(point[0], point[1]));
      return [xy.x, xy.y];
    };

    const mapCursorCoordinates = () => setViewportCursors(props.cursors.map(c => ({
      ...c,
      pos: toViewportCoordinates(c.pos)
    })));

    mapCursorCoordinates();

    viewer.addHandler('update-viewport', mapCursorCoordinates);

    return () => {
      viewer.removeHandler('update-viewport', mapCursorCoordinates);
    }
  }, [props.cursors, viewer]);
  
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
      {viewportCursors.map(cursor => (
        <CursorIcon
          key={cursor.name} 
          color={cursor.color}
          name={cursor.name}
          isTyping={Boolean(cursor.typing)}
          point={cursor.pos} />
      ))}
    </div>
  )

}