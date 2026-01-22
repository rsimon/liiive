import { useMemo } from 'react';
import type { Canvas } from 'manifesto.js';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Separator } from '../../../../../../shadcn/separator';
import { useRoomUIState } from '../../../../_hooks';
import type { IIIFContent, UserPresence } from '../../../../../../types';
import { Avatar } from '../../../../../../components/avatar';
import { TooltipButton } from '../../_shared';
import { Finder } from '../finder';
import { ImageInfo } from '../image-info';

interface PaginationProps {

  canvases: Canvas[];

  current: Canvas;

  iiifContent?: IIIFContent;

  present: UserPresence;

  onGoTo(canvas: Canvas): void;

  onNext(): void;
  
  onPrevious(): void;

}

export const Pagination = (props: PaginationProps) => {

  const { canvases, current } = props;

  const { onThisCanvas } = props.present;

  const setThumbnailsOpen = useRoomUIState(state => state.setThumbnailsOpen);

  const currentIndex = useMemo(() => canvases.indexOf(current) + 1, [canvases, current]);
  
  return (
    <aside className="pointer-events-auto bg-white p-1 rounded-full shadow-xs border border-black/10 flex gap-1.5 items-center z-20">
      <div className="flex items-center gap-1.5">
        <TooltipButton
          disabled={currentIndex === 1}
          variant="ghost" 
          size="icon"
          tooltip="Previous page"
          onClick={props.onPrevious}>
          <ChevronLeft strokeWidth={1.7} />
        </TooltipButton>

        <Finder 
          canvases={canvases}
          current={currentIndex || 1}
          total={canvases.length} 
          onGoTo={props.onGoTo} />

        <TooltipButton 
          disabled={currentIndex === canvases.length}
          variant="ghost" 
          size="icon"
          tooltip="Next page"
          onClick={props.onNext}>
          <ChevronRight strokeWidth={1.7} />
        </TooltipButton>
      </div>

      {onThisCanvas.length > 0 && (
        <div className="flex gap-1">
          {onThisCanvas.map((user, idx) => (
            <Avatar 
              key={`${user.name}:${idx}`}
              user={user} />
          ))}
        </div>
      )}

      <Separator orientation="horizontal" />

      <ImageInfo 
        iiifContent={props.iiifContent} />

      <Separator orientation="horizontal" />

      <TooltipButton
        variant="ghost"
        size="icon"
        tooltip="Open thumbnail strip"
        onPointerDown={() => setThumbnailsOpen(true)}>
        <Maximize2 strokeWidth={1.7} />
      </TooltipButton>
    </aside>
  )
  
}