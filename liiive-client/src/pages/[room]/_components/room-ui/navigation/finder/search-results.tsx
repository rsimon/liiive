import type { ReactNode } from 'react';
import type { Canvas } from 'manifesto.js';
import clsx from 'clsx';
import { Popover, PopoverAnchor, PopoverContent } from '../../../../../../shadcn/popover';
import { Command, CommandItem, CommandList } from '../../../../../../shadcn/command';

interface SearchResultsProps {

  children: ReactNode;

  matches?: Canvas[];

  highlightedIndex: number;

  onHighlight(index: number): void;

  onSelect(canvas: Canvas): void;

}

export const SearchResults = (props: SearchResultsProps) => {

  const { highlightedIndex, matches } = props;

  const onHover = (id: string) => {
    const idx = matches?.findIndex(m => m.id === id);
    props.onHighlight(idx || -1);
  }

  const onSelect = (id: string) => {
    const canvas = matches?.find(m => m.id === id);
    if (canvas)
      props.onSelect(canvas);
  }

  return (
    <Popover 
      open={Boolean(props.matches)}>
      <PopoverAnchor>
        {props.children}
      </PopoverAnchor>

      <PopoverContent
        align="start"
        alignOffset={-44}
        className="rounded-lg w-80 shadow-xs border-black/10 text-sm relative p-0"
        side="top"
        sideOffset={8}
        onOpenAutoFocus={evt => evt.preventDefault()}>
        <Command 
          className="outline-hidden"
          value="-1"
          onValueChange={onHover}>
          <CommandList className="p-2">
            {props.matches?.map((canvas, idx) => (
              <CommandItem
                key={canvas.id}
                value={canvas.id}
                className={clsx('cursor-pointer', idx === highlightedIndex ? 'bg-accent' : undefined)}
                onSelect={() => onSelect(canvas.id)}>
                {canvas.getDefaultLabel()}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

}