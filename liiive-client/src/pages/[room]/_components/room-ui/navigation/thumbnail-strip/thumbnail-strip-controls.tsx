import { Minimize2 } from 'lucide-react';
import type { Canvas } from 'manifesto.js';
import { AnimatePresence, motion } from 'framer-motion';
import { Separator } from '../../../../../../shadcn/separator';
import { useRoomUIState } from '../../../../_hooks';
import type { IIIFContent, UserAwarenessState, UserPresence } from '../../../../../../types';
import { TooltipButton } from '../../_shared/tooltip-button';
import { ImageInfo } from '../image-info';
import { OffCanvasPresence } from './off-canvas-presence';

interface ThumbnailStripControlsProps {

  canvases: Canvas[];

  iiifContent?: IIIFContent;

  present: UserPresence;

  after: UserAwarenessState[];

  before: UserAwarenessState[];

  onGoTo(canvasId: string): void;

}

export const ThumbnailStripControls = (props: ThumbnailStripControlsProps) => {

  const { after, before } = props;

  const setThumbnailsOpen = useRoomUIState(state => state.setThumbnailsOpen);

  return (
    <div>
      <section className="absolute left-1.5 top-0 -translate-y-full text-sm py-1.5">
        <OffCanvasPresence 
          direction="before"
          users={before} 
          onGoTo={props.onGoTo} />
      </section>

      <div className="absolute right-4 top-px -translate-y-full flex z-20">
        <section className="clip-bottom px-2 pt-1.5 pb-0.5 bg-white flex gap-1 items-center rounded-t-[18px] border-t border-l border-r border-black/10 shadow-xs pointer-events-auto">
          {/*
            <Search
              canvases={props.canvases}
              onGoTo={props.onGoTo} />

            <ThumbnailStripFilter />

            <Separator className="mx-1" />
          */}
          
          <ImageInfo iiifContent={props.iiifContent} />

          <Separator className="mx-1" />

          <TooltipButton 
            variant="ghost" 
            size="icon"
            tooltip="Close thumbnail strip"
            onClick={() => setThumbnailsOpen(false)}>
            <Minimize2 strokeWidth={1.7} />
          </TooltipButton>
        </section>

        <AnimatePresence>
          {after.length > 0 && (
            <motion.section 
              className="py-1 text-sm flex items-center mb-1"
              initial={{
                width: 0
              }}
              animate={{
                width: 'auto'
              }}
              exit={{
                width: 0
              }}>
              <OffCanvasPresence 
                direction="after"
                users={after} 
                onGoTo={props.onGoTo} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

}