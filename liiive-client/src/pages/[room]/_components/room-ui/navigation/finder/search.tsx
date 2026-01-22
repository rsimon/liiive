import { useEffect, useRef, useState } from 'react';
import type { Canvas } from 'manifesto.js';
import { Input } from '../../../../../../shadcn/input';
import { useManifestSearch } from '../../../../_hooks';
import { SearchResults } from './search-results';

interface SearchProps {

  canvases: Canvas[];

  className?: string;

  placeholder?: string;

  onGoTo(canvas: Canvas): void;

  onFocus?(): void;

  onBlur?(): void;

}

export const Search = (props: SearchProps) => {

  const inputEl = useRef<HTMLInputElement>(null);

  const search = useManifestSearch(props.canvases);

  const [query, setQuery] = useState('');

  const [matches, setMatches] = useState<Canvas[] | undefined>();

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (query) {
      const matches = search(query);
      setMatches(matches);
      setHighlightedIndex(-1);
    } else {
      setMatches(undefined);
      setHighlightedIndex(-1);
    }
  }, [search, query]);

  const onBlur = () => {
    setQuery('');
    setMatches(undefined);
    setHighlightedIndex(-1);
    
    if (props.onBlur) props.onBlur();
  }

  const onSelect = (canvas: Canvas) => {
    setQuery('');
    setMatches(undefined);
    setHighlightedIndex(-1);

    inputEl.current?.blur();

    props.onGoTo(canvas);
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!matches || matches.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % matches.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(prev =>
        prev === -1 ? matches.length - 1 : (prev - 1 + matches.length) % matches.length
      );
    } else if (event.key === 'Enter') {
      if (highlightedIndex !== -1 && matches[highlightedIndex])
        onSelect(matches[highlightedIndex]);
    }
  }

  return (
    <SearchResults 
      matches={matches}
      highlightedIndex={highlightedIndex}
      onHighlight={setHighlightedIndex}
      onSelect={onSelect}>
      <Input
        disabled
        ref={inputEl}
        className={props.className}
        placeholder={props.placeholder}
        value={query}
        onChange={evt => setQuery(evt.target.value)}
        onFocus={props.onFocus}
        onBlur={onBlur} 
        onKeyDown={onKeyDown} />
    </SearchResults>
  )

}