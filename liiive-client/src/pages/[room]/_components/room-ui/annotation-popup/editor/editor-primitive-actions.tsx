import { Ellipsis, PencilLine, Trash2 } from 'lucide-react';
import { Button } from '../../../../../../shadcn/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../../../../../shadcn/dropdown-menu';

interface EditorPrimitiveActionsProps {

  isReply?: boolean;

  onEdit(): void;

  onDelete(): void;

}

export const EditorPrimitiveActions = (props: EditorPrimitiveActionsProps) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="text-muted-foreground"
          variant="ghost"
          size="icon">
          <Ellipsis strokeWidth={1.7} />
        </Button>
      </DropdownMenuTrigger>

      {props.isReply ? (
        <DropdownMenuContent>
          <DropdownMenuItem 
            className="text-xs"
            onSelect={props.onEdit}>
            <PencilLine className="w-3.5!" /> Edit Reply
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="text-xs text-rose-700 focus:text-rose-700"
            onSelect={props.onDelete}>
            <Trash2 className="w-3.5!" /> Delete Reply
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent>
          <DropdownMenuItem 
            className="text-xs"
            onSelect={props.onEdit}>
            <PencilLine className="w-3.5!" /> Edit Comment
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="text-xs text-rose-700 focus:text-rose-700"
            onSelect={props.onDelete}>
            <Trash2 className="w-3.5!" /> Delete Annotation
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )

}