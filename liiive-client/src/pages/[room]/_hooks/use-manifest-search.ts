import { useCallback, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { Canvas } from 'manifesto.js';

interface CanvasWithLabel {

  canvas: Canvas;

  label: string;

}

export const useManifestSearch = (canvases: Canvas[]) => {

  const canvasesWithLabel: CanvasWithLabel[] = useMemo(() => (
    canvases
      .map(canvas => ({ canvas, label: canvas.getDefaultLabel()! }))
      .filter(c => c.label)
  ), []);

  const fuse = useMemo(() => new Fuse<CanvasWithLabel>([...canvasesWithLabel], { 
    keys: ['label'],
    shouldSort: true,
    threshold: 0.6,
    includeScore: true,
    useExtendedSearch: true
  }), [canvases]);

  const search = useCallback((query: string, limit = 10): Canvas[] =>
    fuse.search(query, { limit })
      .filter(r => (r.score || 0) < 0.2)
      .map(r => r.item.canvas), []);

  return search;

}