import type { ReactNode } from 'react';
import { ToggleGroupItem } from '../../../../../shadcn/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../shadcn/tooltip';

interface TooltipToggleGroupItemProps {

  children: ReactNode;
  
  hotkey: string;

  tooltip: string;

  value: string;

}

export const TooltipToggleGroupItem = (props: TooltipToggleGroupItemProps) => {

  return (
    <ToggleGroupItem 
      value={props.value}
      aria-label={props.tooltip}
      size="icon">
      <Tooltip>
        <TooltipTrigger 
          asChild>
          <div className="h-9 w-9 flex items-center justify-center relative">{props.children}</div>
        </TooltipTrigger>

        <TooltipContent className="flex items-center gap-2 py-1 px-1.5">
          <span>{props.tooltip}</span>
          <div className="bg-white/25 h-5 w-5 flex items-center justify-center rounded">{props.hotkey}</div>
        </TooltipContent>
      </Tooltip>
    </ToggleGroupItem>
  )

}