
import type { User } from '@annotorious/core';
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '../../../../../../shadcn/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../../shadcn/tooltip';
import { Button } from '../../../../../../shadcn/button';
import { Avatar } from '../../../../../../components';
import { SettingsGuest } from './settings-guest';
import { SettingsSignedIn } from './settings-signed-in';

interface AccountSettingsProps {

  me: User;

  onChangeDisplayName(name?: string): void;

}

export const AccountSettings = (props: AccountSettingsProps) => {

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost"
              size="icon">
              <Avatar 
                className="h-9 w-9"
                user={props.me} />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>
          Your user settings
        </TooltipContent>

        <PopoverContent
          align="end"
          alignOffset={-2}
          className={`${props.me.isGuest ? 'w-80': 'w-56'} rounded-lg shadow-xs p-1 border-black/10 text-sm`}
          sideOffset={6}
          onOpenAutoFocus={evt => evt.preventDefault()}>
          <PopoverArrow className="fill-white drop-shadow-xs -translate-y-px" width={16} height={8} />

          {props.me.isGuest ? (
            <SettingsGuest
              me={props.me}
              onChangeDisplayName={props.onChangeDisplayName} />
          ) : (
            <SettingsSignedIn />
          )}
        </PopoverContent>
      </Tooltip>
    </Popover>
  )

}