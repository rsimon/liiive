import { useCallback, useEffect, useMemo } from 'react';
import { useAnnotator, useSelection, type User } from '@annotorious/react';
import { Separator } from '../../../../../shadcn/separator';
import { ToggleGroup } from '../../../../../shadcn/toggle-group';
import type { Room, Tool } from '../../../../../types';
import { useRoomUIState, useUndoRedo } from '../../../_hooks';
import { TooltipToggleGroupItem, TooltipButton } from '../_shared';
import { AccountSettings } from './account-settings';
import { 
  Circle, 
  MousePointerClick, 
  Redo2, 
  ScissorsLineDashed, 
  Square, 
  Tangent, 
  Trash2, 
  TriangleRight, 
  Undo2 
} from 'lucide-react';

interface ToolPanelProps {

  me: User;

  readOnly: boolean;

  room: Room;

  onChangeDisplayName(name?: string): void;

}

export const ToolPanel = (props: ToolPanelProps) => {

  const anno = useAnnotator();

  const { selected } = useSelection();

  const tool = useRoomUIState(state => state.tool);

  const setTool = useRoomUIState(state => state.setTool);

  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const isDeleteEnabled = useMemo(() => (
    selected.length > 0 /* && selected.every(s => s.annotation.target.creator?.id === props.me.id) */
  ), [selected]);

  useEffect(() => {
    if (!anno) return;

    // Automatically flip back to MOVE after create event
    const onCreate = () => setTool('move');

    anno.on('createAnnotation', onCreate);

    return () => {
      anno.off('createAnnotation', onCreate);
    }
  }, [anno]);

  const onDelete = useCallback(() => {
    if (!anno || selected.length === 0) return;

    const toDelete = selected.map(s => s.annotation.id);
    toDelete.forEach(id => anno.removeAnnotation(id));
  }, [anno, selected]);

  const onUndo = useCallback(() => {
    undo();
  }, [undo]);

  const onRedo = useCallback(() => {
    redo();
  }, [redo]);
  
  return (
    <aside className="absolute pointer-events-auto bg-white p-1 rounded-full shadow-xs border border-black/10 top-4 right-4 flex gap-1 items-center z-20">
      {!props.readOnly && (
        <>
          <ToggleGroup 
            type="single"
            aria-label="Drawing tool selection"
            className="flex gap-1"
            value={tool} 
            onValueChange={(value: Tool) => {
              // Prevents deselection of all tools
              if (value) setTool(value);
            }}>

            <TooltipToggleGroupItem
              value="move"
              hotkey="1"
              tooltip="Move image and select anntotations">
              <MousePointerClick className="size-4" strokeWidth={1.7} />
            </TooltipToggleGroupItem>

            <TooltipToggleGroupItem
              value="rectangle"
              hotkey="2"
              tooltip="Rectangle">
              <Square className="size-4" strokeWidth={1.7} />
            </TooltipToggleGroupItem>

            <TooltipToggleGroupItem
              value="polygon"
              hotkey="3"
              tooltip="Polygon">
              <TriangleRight
                strokeWidth={1.6}
                className="size-4 -rotate-18 relative -left-0.5" />
            </TooltipToggleGroupItem>

            <TooltipToggleGroupItem
              value="ellipse"
              hotkey="4"
              tooltip="Ellipse">
              <Circle className="size-4" strokeWidth={1.7} />
            </TooltipToggleGroupItem>

            <TooltipToggleGroupItem
              value="path"
              hotkey="5"
              tooltip="Path">
              <Tangent className="size-4" strokeWidth={1.7} />
            </TooltipToggleGroupItem>

            <TooltipToggleGroupItem
              value="intelligent-scissors"
              hotkey="6"
              tooltip="Smart Scissors">
              <ScissorsLineDashed className="size-5" strokeWidth={1.25} />
            </TooltipToggleGroupItem>
          </ToggleGroup>

          <TooltipButton 
            tooltip="Delete selected annotation"
            disabled={!isDeleteEnabled}
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="text-red-700 disabled:text-foreground">
            <Trash2 strokeWidth={1.7} />
          </TooltipButton>

          <Separator className="mx-0.5" />

          <TooltipButton 
            disabled={!canUndo}
            tooltip="Undo"
            size="icon"
            variant="ghost"
            onClick={onUndo}>
            <Undo2 strokeWidth={1.7} />
          </TooltipButton>

          <TooltipButton 
            disabled={!canRedo}
            tooltip="Redo"
            size="icon"
            variant="ghost"
            onClick={onRedo}>
            <Redo2 strokeWidth={1.7} />
          </TooltipButton>
        </>
      )}

      <AccountSettings 
        me={props.me} 
        onChangeDisplayName={props.onChangeDisplayName} />
    </aside>
  )

}