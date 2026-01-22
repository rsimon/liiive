import type { ImageAnnotation } from '@annotorious/annotorious';
import { downloadJSON } from './download-json';
import { toIIIFAnnotation } from './serialize-iiif';

export const downloadCanvas = (canvasId: string, annotations: ImageAnnotation[]) => {
  const annotationPage = {
    type: 'AnnotationPage',
    items: annotations.map(a => toIIIFAnnotation(canvasId, a))
  }

  downloadJSON(annotationPage, 'annotations.json');
}