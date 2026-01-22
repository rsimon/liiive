import { useMemo, useState } from 'react';
import type { Canvas } from 'manifesto.js';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import type { IIIFContent, UserAwarenessState, UserPresence } from '../../../../../types';
import { useRoomUIState } from '../../../_hooks';
import { OffCanvasPresence, Pagination } from './pagination';
import { THUMBNAIL_STRIP_HEIGHT, ThumbnailStrip, ThumbnailStripControls} from './thumbnail-strip';

interface NavigationProps {

  canvases: Canvas[];

  current: Canvas;

  iiifContent?: IIIFContent;

  presence: Record<string, UserAwarenessState[]>;

  onPrevious(): void;

  onNext(): void;

  onGoTo(canvas: Canvas): void;

}

type VisibleRange = { startIndex: number, endIndex: number };

export const Navigation = (props: NavigationProps) => {

  const { canvases, current, presence } = props;

  const thumbnailsOpen = useRoomUIState(state => state.thumbnailsOpen);

  const [visibleRange, setVisibleRange] = useState<VisibleRange | undefined>()

  const [before, after] = useMemo(() => {
    if (!visibleRange) return [[], []];

    const aggregateUsers = (canvases: Canvas[]) => 
      canvases.reduce<UserAwarenessState[]>((users, canvas) => (
        [...users, ...(presence[canvas.id] || [])]
      ), []);

    const before = aggregateUsers(canvases.slice(0, visibleRange.startIndex + 1));
    const after = aggregateUsers(canvases.slice(visibleRange.endIndex));

    return [before, after];
  }, [presence, visibleRange]);

  const present: UserPresence = useMemo(() => {
    if (!presence || !current) return { 
      after: [],
      before: [],
      onThisCanvas: []
    };

    const currentIdx = canvases.indexOf(current);

    const onThisCanvas = presence[current.id] || [];

    const aggregateUsers = (canvases: Canvas[]) => 
      canvases.reduce<UserAwarenessState[]>((users, canvas) => (
        [...users, ...(presence[canvas.id] || [])]
      ), []);

    const after = aggregateUsers(canvases.slice(currentIdx + 1));
    const before = aggregateUsers(canvases.slice(0, currentIdx));

    return { after, before, onThisCanvas };
  }, [canvases, current, presence]);

  const transition: Transition = {
    duration: 0.2,
    ease: 'easeOut'
  };

  const onGoTo = (canvasId: string) => {
    const canvas = canvases.find(c => c.id === canvasId);
    if (canvas) props.onGoTo(canvas);
  }

  return (
    <div>
      <AnimatePresence initial={false}>
        {thumbnailsOpen ? (
          <div className="relative">
            <motion.div 
              className="shadow-xs relative overflow-hidden z-20"
              key="thumbnails"
              initial={{ 
                borderRadius: 50,
                bottom: 41,
                height: 0, 
                left: 16,
                opacity: 0.5,
                width: 0
              }}
              animate={{ 
                bottom: 0, 
                borderRadius: 0,
                height: THUMBNAIL_STRIP_HEIGHT, 
                left: 0,
                opacity: 1, 
                width: '100%'
              }}
              exit={{ 
                bottom: 41, 
                borderRadius: 50,
                height: 0, 
                left: 16, 
                opacity: 0.5,
                width: 0
              }}
              transition={transition}>
              <ThumbnailStrip
                canvases={props.canvases}
                current={props.current}
                presence={props.presence}
                onGoTo={props.onGoTo} 
                onRangeChanged={setVisibleRange} />
            </motion.div>

            <motion.div
              className="absolute h-full bottom-0"
              initial={{ 
                opacity: 0,
                width: 0
              }}
              animate={{ 
                opacity: 1,
                width: '100%'
              }}
              exit={{ 
                opacity: 0,
                width: 0
              }}
              transition={transition}>
              <ThumbnailStripControls 
                canvases={props.canvases}
                after={after}
                before={before}
                iiifContent={props.iiifContent}
                present={present} 
                onGoTo={onGoTo} />
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="absolute bottom-4 left-4 z-20"
            key="pagination"
            initial={{ 
              opacity: 0, 
              scaleX: 1.15, 
              scaleY: 1.1 
            }}
            animate={{ 
              opacity: 1, 
              scaleX: 1, 
              scaleY: 1 
            }}
            exit={{ 
              opacity: 0, 
              scaleX: 1.15, 
              scaleY: 1.1 
            }}
            transition={transition}>
            <Pagination 
              canvases={props.canvases} 
              current={props.current} 
              iiifContent={props.iiifContent}
              present={present}
              onGoTo={props.onGoTo}
              onNext={props.onNext}
              onPrevious={props.onPrevious} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {(!thumbnailsOpen && (present.after.length + present.before.length > 0)) ? (
          <motion.div 
            className="absolute bottom-5 right-4"
            initial={{ 
              opacity: 0, 
              scale: 0.9 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9 
            }}
            transition={transition}>
            <OffCanvasPresence
              after={present.after}
              before={present.before} 
              onGoTo={onGoTo} />
          </motion.div>
        ) :  null}
      </AnimatePresence>
    </div>
  )

}