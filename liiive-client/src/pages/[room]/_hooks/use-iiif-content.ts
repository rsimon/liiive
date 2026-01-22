import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Canvas } from 'manifesto.js';
import type { IIIFContent } from '../../../types';
import { isImageManifestURL, parseImageInfo, parseManifest } from '../../../hooks/use-manifest-validation';

export const useIIIFContent = (url: string) => {

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | undefined>();

  const [iiifContent, setIIIFContent] = useState<IIIFContent | undefined>();

  const canvases = useMemo(() => (
    (iiifContent?.type === 'MANIFEST') ? iiifContent.parsed.getSequences()[0].getCanvases() : []
  ), [iiifContent]);

  const [currentCanvas, setCurrentCanvas] = useState<Canvas | undefined>();

  const onNext = useCallback(() => {
    if (!currentCanvas) return;

    const currentIdx = canvases.indexOf(currentCanvas);

    const nextIdx = Math.min(currentIdx + 1, canvases.length - 1);

    if (nextIdx > currentIdx)
      setCurrentCanvas(canvases[nextIdx]);
  }, [canvases, currentCanvas]);

  const onPrevious = useCallback(() => {
    if (!currentCanvas) return;

    const currentIdx = canvases.indexOf(currentCanvas);

    const previousIdx = Math.max(currentIdx - 1, 0);

    if (previousIdx < currentIdx)
      setCurrentCanvas(canvases[previousIdx]);
  }, [canvases, currentCanvas]);

  useEffect(() => {
    setError(undefined);
    setIsLoading(true);
    
    fetch(url)
      .then((response) => response.json())
      .then(data => {
        setIsLoading(false);

        if (isImageManifestURL(url)) {
          const content = parseImageInfo(url, data);
          if (content)
            setIIIFContent(content);
          else
            setError('parse_error');
        } else {
          const content = parseManifest(data)
          if (content) {
            setIIIFContent(content);

            const canvases = content.parsed.getSequences()[0].getCanvases();

            const initialURI = new URLSearchParams(window.location.search).get('canvas');
            const initialCanvas = initialURI 
              ? canvases.find(c => c.id === initialURI) || canvases[0]
              : canvases[0];

            setCurrentCanvas(initialCanvas);
          } else {
            setError('parse_error');
          }
        }
      })
      .catch(error => {
        console.error(error);
        setError('fetch_error');
      });
  }, [url]);

  useEffect(() => {
    if (canvases.length === 0 || !currentCanvas) return;

    const params = new URLSearchParams(window.location.search);

    if (currentCanvas === canvases[0])
      params.delete('canvas');
    else
      params.set('canvas', currentCanvas.id);
    
    const url = params.size === 0 
      ? window.location.pathname : `${window.location.pathname}?${params}`;

    window.history.pushState({}, '', url);
  }, [canvases, currentCanvas]);

  return { 
    canvases, 
    currentCanvas, 
    error, 
    iiifContent,
    isLoading,
    onNext,
    onPrevious,
    setCurrentCanvas
  };

}