import { useEffect, useRef, useState } from 'react';
import type { Canvas } from 'manifesto.js';
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { useRoomUIState } from '../../../../_hooks';
import { Search } from './search';

interface FinderProps {

  canvases: Canvas[];

  current: number;

  total: number;

  onGoTo(canvas: Canvas): void;

}

export const Finder = (props: FinderProps) => {

  const [hasFocus, setHasFocus] = useState(false);

  const [placeholderWidth, setPlaceholderWidth] = useState<number>();

  const placeholderRef = useRef<HTMLDivElement>(null);

  const setIsSearchOpen = useRoomUIState(state => state.setIsSearchOpen);

  const onFocus = (focused: boolean) => {
    // setIsSearchOpen(focused);
    // setHasFocus(focused);
  }

  useEffect(() => {
    if (placeholderRef.current)
      setPlaceholderWidth(placeholderRef.current.scrollWidth);
  }, [props.current]);

  return (
    <div className="relative rounded h-8 border bg-muted border-border/60">
      <motion.div 
        className="absolute z-10 h-full flex items-center px-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasFocus ? 1 : 0 }}
        transition={{ duration: 0.1 }}>
        <SearchIcon className="w-4 h-4 text-muted-foreground -mb-px" />
      </motion.div>  

      <motion.div 
        initial={{ width: `${placeholderWidth}px` }}
        animate={{
          width: hasFocus ? '12ch' : `${placeholderWidth}px` 
        }}
        transition={{ duration: 0.1 }}>

        <Search 
          className="w-full pl-8 h-8" 
          canvases={props.canvases} 
          placeholder={hasFocus ? 'Page number or search...' : undefined}
          onGoTo={props.onGoTo} 
          onFocus={() => onFocus(true)}
          onBlur={() => onFocus(false)} />
      </motion.div>

      {!hasFocus && (
        <div 
          ref={placeholderRef}
          className="absolute left-0 top-0 pointer-events-none h-full min-w-16 text-xs flex justify-center items-center">
          <span className="whitespace-nowrap px-2">
            <span className="text-primary">{props.current}</span> 
            <span className="text-muted-foreground font-light"> / {props.total}</span>
          </span>
        </div>
      )}
    </div>
  )

}