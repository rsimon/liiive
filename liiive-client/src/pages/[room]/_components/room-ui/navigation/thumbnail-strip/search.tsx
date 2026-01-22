import { useState } from 'react';
import type { Canvas } from 'manifesto.js';
import { SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../../../../shadcn/tooltip';
import { useRoomUIState } from '../../../../_hooks';
import { Search as SearchInput } from '../Finder';

interface SearchProps {

  canvases: Canvas[];

  onGoTo(canvas: Canvas): void;

}

export const Search = (props: SearchProps) => {

  const [hasFocus, setHasFocus] = useState(false);

  const setIsSearchOpen = useRoomUIState(state => state.setIsSearchOpen);

  const onFocus = (focused: boolean) => {
    setIsSearchOpen(focused);
    setHasFocus(focused);
  }

  return (      
    <motion.div 
      className="relative"
      initial={{ width: 36 }}
      animate={{
        width: hasFocus ? '12ch' : 36
      }}
      transition={{ duration: 0.1 }}>

      <Tooltip>
        <TooltipTrigger className="flex">
          <SearchInput
            className={clsx(hasFocus ? 'rounded-xl bg-muted pl-9' : 'rounded-full bg-white', 'cursor-pointer hover:bg-muted w-full')}
            canvases={props.canvases}
            placeholder={hasFocus ? 'Page number or search...' : undefined}
            onFocus={() => onFocus(true)}
            onBlur={() => onFocus(false)} 
            onGoTo={props.onGoTo} />
          </TooltipTrigger>

          {!hasFocus && (
            <TooltipContent>
              Search
            </TooltipContent>
          )}
      </Tooltip>

      <div className="absolute top-0 px-2.5 left 0 h-full flex items-center pointer-events-none">
        <SearchIcon 
          className="h-4 w-4 mb-px" 
          strokeWidth={1.7} />
      </div>
    </motion.div>
  )

}