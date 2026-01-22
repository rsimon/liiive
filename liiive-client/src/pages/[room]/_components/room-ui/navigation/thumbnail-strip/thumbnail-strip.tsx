import { useCallback, useMemo, useRef, type RefObject } from 'react';
import type { Canvas } from 'manifesto.js';
import { Virtuoso } from 'react-virtuoso';
import useDraggableScroll from 'use-draggable-scroll';
import { useAnnotationCounts } from '../../../../_hooks';
import { hasTouch } from '../../../../../../utils/has-touch';
import type { UserAwarenessState } from '../../../../../../types';
import { Thumbnail } from './thumbnail';

export const THUMBNAIL_STRIP_HEIGHT = 160;

export interface ThumbnailStripProps {

  canvases: Canvas[];

  current: Canvas;

  presence: Record<string, UserAwarenessState[]>;

  onGoTo(canvas: Canvas): void;

  onRangeChanged(range: { startIndex: number, endIndex: number }): void;

}

export const ThumbnailStrip = (props: ThumbnailStripProps) => {

  const { canvases, current } = props;

  const scrollerRef = useRef<HTMLElement>(null) as RefObject<HTMLElement>;

  const currentIdx = useMemo(() => canvases.indexOf(current), [canvases, current]);

  const counts = useAnnotationCounts(state => state.counts);

  const { onMouseDown } = useDraggableScroll(scrollerRef, { direction: 'horizontal' });

  const renderThumbnail = useCallback((idx: number) => {
    const canvas = canvases[idx];
    const users = props.presence[canvas.id] || [];

    return (
      <Thumbnail
        canvas={canvas} 
        annotationCount={counts[canvas.id] || 0}
        isCurrent={canvas === props.current}
        size={THUMBNAIL_STRIP_HEIGHT - 56}
        users={users}
        onClick={() => props.onGoTo(canvas)} />
    )
  }, [canvases, current, props.onGoTo, counts, props.presence]);
 
  return (
    <div className="pointer-events-auto w-full bg-white relative">
      <Virtuoso
        className="px-1 border-t border-black/10"
        style={{ height: THUMBNAIL_STRIP_HEIGHT }}
        horizontalDirection
        initialTopMostItemIndex={Math.max(0, currentIdx - 1)}
        itemContent={renderThumbnail} 
        rangeChanged={props.onRangeChanged}
        scrollerRef={ref => scrollerRef.current = (ref as HTMLElement)}
        totalCount={canvases.length}
        onPointerDown={hasTouch ? undefined : onMouseDown} />
    </div>
  )
  
}