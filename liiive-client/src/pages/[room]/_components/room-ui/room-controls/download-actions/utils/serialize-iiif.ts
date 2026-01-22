import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { ShapeType } from '@annotorious/annotorious';
import type { 
  AnnotationBody, 
  EllipseGeometry, 
  ImageAnnotation, 
  ImageAnnotationTarget, 
  PolygonGeometry, 
  RectangleGeometry 
} from '@annotorious/annotorious';

const toIIIFBody = (body: AnnotationBody) => {
  const { 
    created,
    creator,
    purpose,
    value
  } = body;

  return {
    created,
    creator: creator?.name,
    purpose,
    type: 'TextualBody',
    format: 'text/html',
    value: value ? generateHTML(JSON.parse(value), [StarterKit, Link, Underline]) : undefined
  }
}

const toIIIFTarget = (canvasId: string, target: ImageAnnotationTarget) => {
  const { selector } = target;

  if (selector.type === ShapeType.RECTANGLE) {
    const { x, y, w, h } = selector.geometry as RectangleGeometry;
    return `${canvasId}#xywh=${Math.round(x)},${Math.round(y)},${Math.round(w)},${Math.round(h)}`;
  } else if (selector.type === ShapeType.POLYGON) {
    const { points } = selector.geometry as PolygonGeometry;
    return {
      type: 'SpecificResource',
      source: canvasId,
      selector: {
        type: 'SvgSelector',
        value: `<svg><polygon points="${points.map((xy) => xy.map(Math.round).join(',')).join(' ')}" /></svg>`
      }
    }
  } else if (selector.type === ShapeType.ELLIPSE) {
    const geom = selector.geometry as EllipseGeometry;
    return {
      type: 'SpecificResource',
      source: canvasId,
      selector: {
        type: 'SvgSelector',
        value: `<svg><ellipse cx="${Math.round(geom.cx)}" cy="${Math.round(geom.cy)}" rx="${Math.round(geom.rx)}" ry="${Math.round(geom.ry)}" /></svg>`
      }
    }
  }
}

export const toIIIFAnnotation = (
  canvasId: string,
  annotation: ImageAnnotation,
) => ({
  id: `${canvasId.endsWith('/') ? canvasId  : `${canvasId}/`}${annotation.id}`,
  type: 'Annotation',
  motivation: 'commenting',
  body: annotation.bodies.map(toIIIFBody),
  target: toIIIFTarget(canvasId, annotation.target)
})