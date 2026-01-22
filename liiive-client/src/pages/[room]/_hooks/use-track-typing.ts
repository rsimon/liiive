import { useCallback, useEffect, useRef, useState } from 'react';

const DEBOUNCE = 2000;

export const useTrackTyping = () => {

  const [isTyping, setIsTyping] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onKeyDown = useCallback(() => {
    setIsTyping(true);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, DEBOUNCE);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return { isTyping, onKeyDown };

}