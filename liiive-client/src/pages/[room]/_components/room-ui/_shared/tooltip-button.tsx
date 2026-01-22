import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '../../../../../shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../shadcn/tooltip';

type TooltipButtonProps = ButtonProps & {

  tooltip: ReactNode;

}

export const TooltipButton = (props: TooltipButtonProps) => {

  const { tooltip, ...rest } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          aria-label={typeof tooltip === 'string' ? tooltip : undefined}
          {...rest} />
      </TooltipTrigger>

      <TooltipContent className="px-2 py-1.5">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )

}