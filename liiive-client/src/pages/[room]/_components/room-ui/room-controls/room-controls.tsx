import { memo, useCallback } from 'react';
import { RotateCcwSquare, RotateCwSquare, ZoomIn, ZoomOut } from 'lucide-react';
import type { Canvas } from 'manifesto.js';
import type { User } from '@annotorious/core';
import { Separator } from '../../../../../shadcn/separator';
import { useViewer } from '../../../_hooks';
import { TooltipButton } from '../_shared';
import type { IIIFContent, IIIFImage, Room } from '../../../../../types';
import { CountdownTimer } from './countdown-timer';
import { LeaveRoom } from './leave-room';
import { Share } from './share';
import { XRayMode } from './x-ray-mode';
import { Download } from './download-actions';

interface RoomControlsProps {

  me: User;

  readOnly: boolean;

  room: Room;

  current?: IIIFImage | Canvas;

  iiifContent?: IIIFContent;

}

export const RoomControls = memo((props: RoomControlsProps) => {

  const viewer = useViewer(state => state.viewer);

  const onRotate = useCallback((dir: 'cw' | 'ccw') => () => {
    // @ts-ignore - missing in TS declaration
    viewer?.viewport.rotateBy(dir === 'cw' ? 90 : -90);
  }, [viewer]);

  const onZoom = useCallback((factor: number) => () => {
    viewer?.viewport.zoomBy(factor);
  }, [viewer]);

  return (
    <aside className="absolute pointer-events-auto bg-white p-1 rounded-full shadow-xs border border-black/10 top-4 left-4 flex gap-1 items-center z-20">
      <Share 
        readOnly={props.readOnly}
        room={props.room} 
        iiifContent={props.iiifContent} />

      {props.room.time_limit_hours && (
        <CountdownTimer 
          room={props.room} />
      )}

      {!props.readOnly  && (
        <LeaveRoom me={props.me} />
      )}

      <Separator className="mx-0.5" />

      <Download 
        current={props.current} 
        iiifContent={props.iiifContent} />

      <Separator className="mx-0.5" />

      <XRayMode />

      <TooltipButton
        variant="ghost"
        size="icon"
        tooltip={
          <div className="flex items-center gap-2">
            <div>Rotate image counter-clockwise</div>
            
            <div className="flex gap-0.5">
              <div className="bg-white/25 h-5 flex items-center px-1 justify-center rounded">SHIFT</div>
              +
              <div className="bg-white/25 h-5 w-5 flex items-center justify-center rounded">R</div>
            </div>
          </div>
        }
        onClick={onRotate('ccw')}>
        <RotateCcwSquare strokeWidth={1.7} />
      </TooltipButton>

      <TooltipButton
        variant="ghost"
        size="icon"
        tooltip={
          <div className="flex items-center gap-2">
            <span>Rotate image clockwise</span>
            <div className="bg-white/25 h-5 w-5 flex items-center justify-center rounded">R</div>
          </div>
        }
        onClick={onRotate('cw')}>
        <RotateCwSquare strokeWidth={1.7} />
      </TooltipButton>

      <TooltipButton
        variant="ghost"
        size="icon"
        tooltip={
          <div className="flex items-center gap-2">
            <span>Zoom in</span>
            <div className="bg-white/25 h-5 w-5 flex items-center justify-center rounded">+</div>
          </div>
        }
        onClick={onZoom(2)}>
        <ZoomIn strokeWidth={1.7} />
      </TooltipButton>

      <TooltipButton
        variant="ghost"
        size="icon"
        tooltip={
          <div className="flex items-center gap-2">
            <span>Zoom out</span>
            <div className="bg-white/25 h-5 w-5 flex items-center justify-center rounded">-</div>
          </div>
        }
        onClick={onZoom(0.5)}>
        <ZoomOut strokeWidth={1.7} />
      </TooltipButton>
    </aside>
  )

});