import { useMemo } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { useConfirmationDialog } from '../../../../components';
import { Button } from '../../../../shadcn/button';
import type { ProfileQuotas, Room } from '../../../../types';
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from '../../../../shadcn/dropdown-menu';

interface MyRoomActionsProps {

  permanent: number;

  quotas?: ProfileQuotas;

  room: Room;

  onDelete(): void;

  onChangeTimeLimit(limit: 'permanent' | 'temporary'): void;

  onChangeReadOnly(readonly: boolean): void;

}

export const MyRoomActions = (props: MyRoomActionsProps) => {

  const { permanent, quotas } = props;

  const onChangeTimeLimit = (value: string) => props.onChangeTimeLimit(value as 'permanent' | 'temporary');

  const onChangeReadOnly = (value: string) => props.onChangeReadOnly(value === 'readonly');

  const [confirmDelete, ConfirmDelete] = useConfirmationDialog({ 
    confirmIcon: <Trash2 className="mb-0.5" strokeWidth={1.8} />,
    confirmLabel: 'Delete Room', 
    destructive: true,
    message: 'This action cannot be undone. Deleting this room will remove it and erase all associated annotations.',
    onCancel: () => {},
    onConfirm: props.onDelete
  });

  const hasFreePermantRooms = useMemo(() => {
    if (!quotas) return false;
    return permanent < quotas.permanent_rooms_limit;
  }, [permanent, quotas]);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="cursor-pointer hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:outline-0 text-white/70 hover:text-white">
            <Settings className="size-4" strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="end" 
          alignOffset={-8}
          sideOffset={0}
          collisionPadding={10}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="bg-sky-900 font-light text-white border-white/10 tracking-wide max-w-80">

          <DropdownMenuLabel
            className="px-1.5 py-1 text-sm font-semibold text-sky-200/80">
            Storage
          </DropdownMenuLabel>

          <DropdownMenuRadioGroup 
            value={props.room.time_limit_hours ? 'temporary' : 'permanent'}
            onValueChange={onChangeTimeLimit}>
            <DropdownMenuRadioItem 
              value="temporary"
              className="focus:bg-white/10 focus:text-white block leading-relaxed pt-1.5">
              <div className="-my-0.75">
                <strong className="font-semibold">Temporary</strong>
                <p className="text-xs text-white/70">Room expires after 24 hours. Annotations will be deleted.</p>
              </div>
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem 
              disabled={(!hasFreePermantRooms && Boolean(props.room.time_limit_hours))}
              value="permanent"
              className="focus:bg-white/10 focus:text-white block leading-relaxed pt-1.5 data-disabled:*:opacity-25!">
              <div className="-my-0.75">
                <strong className="font-semibold">Permanent</strong>
                <p className="text-xs text-white/70">Room and all annotations remain stored permanently.</p>
              </div>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuLabel
            className="px-1.5 pb-1 pt-3 text-sm font-semibold text-sky-200/80">
            Public Access
          </DropdownMenuLabel>

          <DropdownMenuRadioGroup 
            value={props.room.is_readonly ? 'readonly' : 'open'}
            onValueChange={onChangeReadOnly}>
            <DropdownMenuRadioItem 
              value="open"
              className="focus:bg-white/10 focus:text-white block leading-relaxed pt-1.5">
              <div className="-my-0.75">
                <strong className="font-semibold">Open</strong>
                <p className="text-xs text-white/70">Any visitor to this room can create, edit and reply to annotations.</p>
              </div>
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem 
              value="readonly"
              className="focus:bg-white/10 focus:text-white block leading-relaxed pt-1.5">
              <div className="-my-0.75">
                <strong className="font-semibold">Read-only</strong> <span 
                  className="bg-amber-600 rounded-full font-semibold 
                    text-xs text-white px-1.5 py-px relative bottom-px ml-1 leading-normal">
                  Beta
                </span>
                <p className="text-xs text-white/70">This room is read-only to visitors. No-one can create, edit or reply to annotations, except you.</p>
              </div>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator 
            className="bg-white/15" />

          <DropdownMenuItem 
            className="text-amber-400 focus:text-amber-400 focus:bg-white/10 justify-center py-2"
            onSelect={confirmDelete}>
            <Trash2 className="mb-0.5" strokeWidth={1.8} /> Delete this room
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDelete />
    </>
  )

}