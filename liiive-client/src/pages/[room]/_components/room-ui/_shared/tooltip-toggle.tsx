import type { ReactNode } from 'react';
import { Toggle } from '../../../../../shadcn/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../shadcn/tooltip';

interface TooltipToggleProps {

  children: ReactNode;
  
  hotkey?: string;

  tooltip: string;

  pressed?: boolean;

  onPressedChange?(pressed: boolean): void;
  
}

export const TooltipToggle = (props: TooltipToggleProps) => {

  return (
    <Toggle
      aria-label={props.tooltip}
      size="icon"
      pressed={props.pressed}
      onPressedChange={props.onPressedChange}>
      <Tooltip>
        <TooltipTrigger 
          asChild>
          <div className="h-9 w-9 flex items-center justify-center relative">{props.children}</div>
        </TooltipTrigger>

        <TooltipContent className="flex items-center gap-2 py-1 px-1.5">
          <span>{props.tooltip}</span>
          {props.hotkey && (
            <div className="bg-white/25 h-5 w-5 flex items-center justify-center rounded">{props.hotkey}</div>
          )}
        </TooltipContent>
      </Tooltip>
    </Toggle>
  )

}