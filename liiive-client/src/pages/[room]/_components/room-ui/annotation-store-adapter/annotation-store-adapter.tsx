import { useEffect } from 'react';
import type { Canvas } from 'manifesto.js';
import { v4 as uuidv4 } from 'uuid';
import { parseW3CImageAnnotation } from '@annotorious/annotorious';
import { Origin, useAnnotator } from '@annotorious/react';
import type { AnnotationBody, AnnotoriousOpenSeadragonAnnotator, ImageAnnotation, ParseResult, StoreChangeEvent } from '@annotorious/react';
import { generateJSON } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useAnnotationStore } from '../../../_hooks';
import type { IIIFImage } from '../../../../../types';

const extensions = [
  StarterKit.configure({
    heading: false
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-500 underline hover:text-blue-600'
    }
  }),
  Underline
];

interface AnnotationStoreAdapterProps {

  canvas: Canvas | IIIFImage;

}

const getAnnotations = (canvas: Canvas) => {
  if (!('annotations' in canvas.__jsonld)) return [];
  
  if (!Array.isArray(canvas.__jsonld.annotations)) return [];
  
  const crosswalkBodies = (bodies: AnnotationBody[]) => {
    const keepPurposes = new Set(['commenting', 'replying', 'describing']);

    const crosswalkPurpose = (purpose?: string) =>
      (!purpose || purpose === 'describing') ? 'commenting' : purpose;

    const toKeep = bodies.filter(b => typeof b.value === 'string' && (!b.purpose || keepPurposes.has(b.purpose)));

    return toKeep.map(b => ({
      id: b.id || uuidv4(),
      purpose: crosswalkPurpose(b.purpose), 
      created: b.created,
      value: JSON.stringify(generateJSON(b.value!, extensions))
    }));
  }

  const annotations = (canvas.__jsonld.annotations.flatMap((a: any) => (a.items || [])) || [])
    .filter((a: any) => a.type === 'Annotation');

  return annotations.map((a: any) => parseW3CImageAnnotation(a))
    .map((r: ParseResult<ImageAnnotation>) => r.parsed!)
    .filter(Boolean)
    .map((a: ImageAnnotation) => ({
      ...a,
      bodies: crosswalkBodies(a.bodies)
    })) as ImageAnnotation[];
}

export const AnnotationStoreAdapter = (props: AnnotationStoreAdapterProps) => {

  const { canvas } = props;

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const yjsStore = useAnnotationStore();

  useEffect(() => {
    if (!anno || !yjsStore) return;

    const annotoriousStore = anno.state.store;

    // Sync local Annotorious changes to YJS. 
    // Note: YJS cannot handle Date objects - we need to serialize!
    const onAnnotoriousChange = (event: StoreChangeEvent<ImageAnnotation>) => {
      event.changes.created?.forEach(annotation => {
        yjsStore.addAnnotation(canvas.id, annotation);
      });

      event.changes.updated?.forEach(update => {
        yjsStore.updateAnnotation(canvas.id, update);
      });

      event.changes.deleted?.forEach(annotation => {
        yjsStore.deleteAnnotation(canvas.id, annotation);
      });
    }

    annotoriousStore.observe(onAnnotoriousChange, { origin: Origin.LOCAL });

    // Sync remote YJS changes to Annotorious.
    // Note: remote annotations will have serialized dates!
    const unobserveYJS = yjsStore.observeCanvas(canvas.id, event => {
      if (event.add)
        annotoriousStore.addAnnotation(event.add, Origin.REMOTE);
      
      if (event.addAll)
        annotoriousStore.bulkUpsertAnnotations(event.addAll, Origin.REMOTE);

      if (event.update)
        annotoriousStore.upsertAnnotation(event.update, Origin.REMOTE);

      if (event.delete)
        annotoriousStore.deleteAnnotation(event.delete, Origin.REMOTE);
    });

    // Initial load
    const initial = yjsStore.getAnnotations(canvas.id);
    if (initial.length > 0)
      annotoriousStore.bulkAddAnnotations(initial, true, Origin.REMOTE);

    return () => {
      annotoriousStore.unobserve(onAnnotoriousChange);
      unobserveYJS();
    }
  }, [anno, yjsStore, canvas.id]);

  useEffect(() => {
    if (!anno) return;

    if ('type' in canvas && canvas.type === 'IMAGE') return;

    const annotations = getAnnotations(canvas as Canvas);

    const toAdd = annotations.reduce<ImageAnnotation[]>((toAdd, annotation) => {
      const existing = anno.state.store.getAnnotation(annotation.id);
      return existing ? toAdd : [...toAdd, annotation];
    }, []);

    anno.state.store.bulkAddAnnotations(toAdd, false, Origin.REMOTE);
  }, [anno, canvas]);

  return null;

}