import { useEffect, useMemo, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../../shadcn/tooltip';
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '../../../../../../shadcn/popover';
import { useClaimableRooms } from '../../../../../../hooks/use-claimableRooms';
import { getRemainingTime } from '../../../../../../utils/get-remaining-time';
import type { Room } from '../../../../../../types';

import './countdown-timer.css';

interface CountdownTimerProps {

  room: Room;

}

export const CountdownTimer = (props: CountdownTimerProps) => {

  const [timeRemaining, setTimeRemaining] = useState(() => getRemainingTime(props.room));

  const { loadClaimableRooms } = useClaimableRooms();

  const isClaimableRoom = useMemo(() => {
    const { owner } = props.room;

    // This room already has an owner
    if (owner?.id) return false;

    // Rooms created by me while I was not logged in
    const claimable = loadClaimableRooms();
    return Boolean(claimable.find(r => r.id === props.room.id));
  }, [props.room, loadClaimableRooms]);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getRemainingTime(props.room);
      setTimeRemaining(remaining);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getRemainingTime(props.room);
      setTimeRemaining(remaining);
    }, 10000);

    return () => clearInterval(timer);
  }, [props.room]);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <div className="cursor-pointer flex px-3 h-9 -mr-2 rounded-full items-center gap-px text-sm text-red-700 hover:bg-red-50">
              <div>{timeRemaining.hours}</div>
              <div className="pulse-effect">:</div>
              <div>{timeRemaining.minutes}</div>
            </div>
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>
          This room is <strong>temporary</strong>
        </TooltipContent>

        <PopoverContent
          className="rounded-lg w-80 shadow-lg border-black/10 text-sm relative px-3 pt-3.5 pb-1.5"
          align="center"
          collisionPadding={16}
          sideOffset={6}
          onOpenAutoFocus={evt => evt.preventDefault()}>
          <PopoverArrow className="fill-white drop-shadow-xs -translate-y-px" width={16} height={8} />

          <div className="flex flex-col items-center justify-center text-red-700 leading-relaxed">
            <div className="text-xs">
              Temporary room · deleted when time expires
            </div>

            <strong className="font-bold my-2.5 py-1 bg-red-100 w-full text-center rounded">
              Time remaining {timeRemaining.hours}h {timeRemaining.minutes}min
            </strong>

            {isClaimableRoom && (
              <div className="text-xs pb-2">
                <a href={`/sign-in?claim=${props.room.id}`} className="underline">Sign in</a> to claim this room and keep it longer.
              </div>
            )}
          </div>
        </PopoverContent>
      </Tooltip>
    </Popover>
  )

}