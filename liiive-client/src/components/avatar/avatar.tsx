import { useMemo } from 'react';
import { UserRound } from 'lucide-react';
import clsx from 'clsx';
import type { User } from '@annotorious/core';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import { Avatar as AvatarPrimitive, AvatarImage } from '../../shadcn/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../shadcn/tooltip';

interface AvatarProps {

  className?: string;

  user?: User;

}

export const Avatar = (props: AvatarProps) => {

  const avatar = useMemo(() => {
    if (!props.user) return;

    if (props.user.avatar) {
      return props.user.avatar;
    } else {
      return createAvatar(initials, {
        seed: props.user.name
      }).toDataUri();
    }
  }, [props.user]);

  return props.user ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <AvatarPrimitive className={clsx('h-8 w-8', props.className)}>
          <AvatarImage src={avatar} referrerPolicy="no-referrer" />
        </AvatarPrimitive>
      </TooltipTrigger>

      <TooltipContent>
        {props.user.name}
      </TooltipContent>
    </Tooltip>
  ) : (
    <AvatarPrimitive 
      className={clsx('h-8 w-8 bg-gray-200 border border-gray-300', props.className)}>
      <UserRound className="text-gray-400/80 flex items-center" strokeWidth={1.25} />
    </AvatarPrimitive>
  )

}