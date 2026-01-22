import { useState } from 'react';
import { DoorClosed, DoorOpen } from 'lucide-react';
import type { User } from '@annotorious/core';
import { TooltipButton } from '../../_shared';

interface LeaveRoomProps {

  me: User;

}

export const LeaveRoom = (props: LeaveRoomProps) => {

  const [hover, setHover] = useState(false);

  return (
    <TooltipButton
      variant="ghost"
      size="icon"
      tooltip="Leave Room"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}>
      <a href={props.me.isGuest ? '/' : '/dashboard'}>
        {hover ? (
          <DoorOpen className="size-5!" strokeWidth={1.5}/>
        ) : (
          <DoorClosed className="size-5!" strokeWidth={1.5}/>
        )}
      </a>
    </TooltipButton>
  )
  
}