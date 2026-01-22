import { useCallback, useEffect, useMemo, useRef } from 'react';
import { create } from 'zustand';
import { dequal } from 'dequal/lite';
import * as Y from 'yjs';
import type { Update } from '@annotorious/core';
import type { ImageAnnotation } from '@annotorious/annotorious';
import { reviveDates, serializeDates } from '../../../utils/serialize-dates';
import type { YJSAnnotation, YJSAnnotationBody, YJSImageAnnotationTarget } from '../../../types';

export const ydoc = new Y.Doc();

const ymap = ydoc.getMap<Y.Map<YJSAnnotation>>('annotations');

interface YJSStoreChange {

  add?: ImageAnnotation;
  
  addAll?: ImageAnnotation[];

  update?: ImageAnnotation;

  delete?: string;

}

interface AnnotationCountsState {

  counts: Record<string, number>;

  setCounts: (counts: Record<string, number>) => void;

}

export const useAnnotationCounts = create<AnnotationCountsState>(set => ({

  counts: {},

  setCounts: next => set(state => {
    return dequal(state.counts, next) ? state : { counts: next };
  })

}));

const isTarget = (item: YJSImageAnnotationTarget | YJSAnnotationBody): item is YJSImageAnnotationTarget =>
  (item as YJSImageAnnotationTarget).selector !== undefined;

const isBody = (item: YJSImageAnnotationTarget | YJSAnnotationBody): item is YJSAnnotationBody =>
  (item as YJSAnnotationBody).id !== undefined && !('selector' in item);

const toImageAnnotation = (yarray: YJSAnnotation): ImageAnnotation => {
  const arr = yarray.toArray();

  const target = arr.find(item => isTarget(item));
  const bodies = arr.filter(item => isBody(item));

  return {
    id: target?.annotation,
    target: target ? reviveDates(target) : undefined,
    bodies: bodies.map(reviveDates)
  } as ImageAnnotation;
}

const toYJSAnnotation = (annotation: ImageAnnotation): YJSAnnotation => 
  Y.Array.from([
    serializeDates<YJSImageAnnotationTarget>(annotation.target),
    ...annotation.bodies.map(b => serializeDates<YJSAnnotationBody>(b))
  ]);

export const useAnnotationStore = () => {

  const canvasObserversRef = useRef(new Map<string, ((change: YJSStoreChange) => void)[]>());

  const { setCounts } = useAnnotationCounts();

  const updateCounts = useCallback(() => {
    const next: { [canvasId: string]: number } = {};

    ymap.forEach((canvas, canvasId) => {
      next[canvasId] = canvas.size;
    });

    setCounts(next);
  }, [setCounts]);

  const emit = useCallback((canvasId: string, change: YJSStoreChange) => {
    const observers = canvasObserversRef.current;
    if (observers.has(canvasId)) {
      observers.get(canvasId)!.forEach(callback => callback(change));
    }
  }, []);

  const getAnnotations = useCallback((canvasId: string) => {
    const canvas = ymap.get(canvasId);
    return canvas ? [...canvas.values()].map(toImageAnnotation) : [];
  }, []);

  const getAnnotation = useCallback((canvasId: string, annotationId: string) => {
    const canvas = ymap.get(canvasId);
    if (canvas) {
      const yjsAnnotation = canvas.get(annotationId);
      return yjsAnnotation ? toImageAnnotation(yjsAnnotation) : undefined;
    }
  }, [getAnnotations]);

  const addAnnotation = useCallback((canvasId: string, annotation: ImageAnnotation) => {
    const existingCanvas = ymap.get(canvasId);
    if (!existingCanvas) {
      const canvas = new Y.Map<YJSAnnotation>();
      canvas.set(annotation.id, toYJSAnnotation(annotation));
      ymap.set(canvasId, canvas);
    } else {
      existingCanvas.set(annotation.id, toYJSAnnotation(annotation));
    }
  }, []);

  const deleteAnnotation = useCallback((canvasId: string, annotation: ImageAnnotation) => {
    const canvas = ymap.get(canvasId);
    if (canvas)
      canvas.delete(annotation.id);
  }, []);

  const listCanvasIds = useCallback(() => [...ymap.keys()], []);

  const updateAnnotation = useCallback((canvasId: string, update: Update<ImageAnnotation>) => {
    const canvas = ymap.get(canvasId);
    if (canvas) {
      const existing = canvas.get(update.oldValue.id);
      if (existing) {
        // Needed to determine index
        const { 
          targetUpdated, 
          bodiesCreated, 
          bodiesUpdated, 
          bodiesDeleted 
        } = update;

        if (targetUpdated) {
          const { newTarget } = targetUpdated;
          
          const arr = existing.toArray();
          existing.delete(arr.findIndex(t => isTarget(t)));

          existing.unshift([serializeDates<YJSImageAnnotationTarget>(newTarget)]);
        }

        if (bodiesCreated && bodiesCreated.length > 0)
          existing.push(bodiesCreated.map(serializeDates<YJSAnnotationBody>));

        if (bodiesDeleted && bodiesDeleted.length > 0) {
          bodiesDeleted.forEach(toDelete => {
            const arr = existing.toArray();
            existing.delete(arr.findIndex(b => isBody(b) && b.id === toDelete.id))
          });  
        }

        if (bodiesUpdated && bodiesUpdated.length > 0) {
          bodiesUpdated.forEach(({ oldBody }) => {
            const arr = existing.toArray();
            existing.delete(arr.findIndex(b => isBody(b) && b.id === oldBody.id))
          });  

          existing.push(bodiesUpdated.map(u => serializeDates<YJSAnnotationBody>(u.newBody)));
        }
      } else {
        // Update to an annotation that's not in the YJS store yet - happens
        // for annotations embedded in the manifest!
        addAnnotation(canvasId, update.newValue);
      }
    } else {
      // Same as above: update to embedded
      addAnnotation(canvasId, update.newValue);
    }
  }, []);
  
  const observeCanvas = useCallback((canvasId: string, callback: (events: YJSStoreChange) => void) => {
    const observers = canvasObserversRef.current;
    if (observers.has(canvasId)) {
      observers.get(canvasId)!.push(callback);
    } else {
      observers.set(canvasId, [callback]);
    }

    return () => {
      const observers = canvasObserversRef.current;
      const callbacks = observers.get(canvasId);
      
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1)
          callbacks.splice(index, 1);
        
        // Delete array if this was the last observer
        if (callbacks.length === 0)
          observers.delete(canvasId);
      }
    };
  }, []);

  const onDeepChange = useCallback((events: Y.YEvent<any>[]) => {
    const remoteEvents = events.filter(e => !e.transaction.local);
    remoteEvents.forEach(event => {
      const isRoot = !event.target.parent;
      if (isRoot) {
        // Event at the root ymap level
        event.changes.keys.forEach((change, canvasId) => {
          if (change.action === 'add') {
            const addAll = getAnnotations(canvasId);
            emit(canvasId, { addAll });
          }
        });
      } else {
        const isCanvas = !event.target._item.parent._item;

        if (isCanvas) {
          const canvasId = event.target._item.parentSub;
          event.changes.keys.forEach((change, key) => {
            if (change.action === 'add') {
              const add = getAnnotation(canvasId, key);

              if (add) 
                emit(canvasId, { add });
            } else if (change.action === 'update') {
              const update = getAnnotation(canvasId, key);
              if (update)
                emit(canvasId, { update });
            } else if (change.action === 'delete') {
              emit(canvasId, { delete: key });
            }
          });
        } else {
          const canvasId = event.target._item.parent._item.parentSub;
          const annotationId = event.target._item.parentSub;

          const update = getAnnotation(canvasId, annotationId);

          if (update)
            emit(canvasId, { update });
        }
      }
    });

    // Update canvas/annotation counts
    updateCounts();
  }, [emit, getAnnotation, getAnnotations, updateCounts]);

  useEffect(() => {
    ymap.observeDeep(onDeepChange);

    return () => {
      ymap.unobserveDeep(onDeepChange);
    }
  }, [onDeepChange]);

  return useMemo(() => ({
    addAnnotation, 
    deleteAnnotation,
    getAnnotation,
    getAnnotations,
    listCanvasIds,
    observeCanvas, 
    updateAnnotation
  }), [
    addAnnotation,
    deleteAnnotation,
    getAnnotation,
    getAnnotations,
    listCanvasIds,
    observeCanvas,
    updateAnnotation
  ]);

}


