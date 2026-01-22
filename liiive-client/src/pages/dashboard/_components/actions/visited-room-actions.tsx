import { Ellipsis, X } from 'lucide-react';
import { Button } from '../../../../shadcn/button';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../shadcn/dropdown-menu';

interface VisitedRoomActionsProps {

  onRemoveFromList(): void;

}

export const VisitedRoomActions = (props: VisitedRoomActionsProps) => {

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="cursor-pointer hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:outline-0 text-white/70 hover:text-white">
          <Ellipsis className="size-4" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        alignOffset={-8}
        sideOffset={0}
        collisionPadding={10}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="bg-sky-900 font-light text-white border-white/10 tracking-wide">

        <DropdownMenuItem 
          className="focus:bg-white/10 focus:text-white pr-3"
          onSelect={props.onRemoveFromList}>
          <X className="" strokeWidth={1.8} />Remove from list
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

}