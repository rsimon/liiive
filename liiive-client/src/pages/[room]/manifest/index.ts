import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import * as Y from 'yjs'
import fetch from 'node-fetch';
import { convertPresentation2  } from '@iiif/parser/presentation-2';
import { wrapImageInfo } from '../../../utils/wrap-image-info';
import type { RoomRecord, YJSAnnotation } from '../../../types';
import { toIIIFAnnotation, toImageAnnotation } from './_crosswalk';

export const prerender = false;

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_SECRET_SERVICE_API_KEY;

export const supabaseServiceClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export const GET: APIRoute = async ({ params, request }) => {

  const roomId = params.room;

  const { data: room, error: roomError } = await supabaseServiceClient
    .from('room')
    .select()
    .eq('id', roomId)
    .returns<RoomRecord[]>()
    .single()

  if (roomError) {
    // Room not found: 404
    return new Response(
      JSON.stringify({ message: 'Not Found' }),
      { status: 404 }
    );
  }

  if (room.is_private) {
    // Private room: 401
    return new Response(
      JSON.stringify({ message: 'Not Authorized' }),
      { status: 401 }
    );
  }

  if (room.time_limit_hours) {
    // Temporary room: 404
    return new Response(
      JSON.stringify({ message: 'Not Found' }),
      { status: 404 }
    );
  }

  const { data: blob, error: storageError } = await supabaseServiceClient
    .storage
    .from('annotations')
    .download(roomId!)

  if (storageError) {
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }

  const data = await blob.arrayBuffer();

  const doc = new Y.Doc();
  Y.applyUpdate(doc, new Uint8Array(data));

  const annotations = doc.getMap<Y.Map<YJSAnnotation>>('annotations');

  const flat = [...annotations.entries()].reduce<YJSAnnotation[]>((all, [_, annotations]) => {
    return [...all, ...annotations.values()];
  }, [])

  if (room.iiif_type === 'IMAGE') {
    const wrapped = await wrapImageInfo(room.iiif_content);

    const derivative = {
      ...wrapped,
      items: (wrapped.items || []).map((canvasItem: any) => ({
        ...canvasItem,
        annotations: [{
          id: `${canvasItem.id}${canvasItem.id.endsWith('/') ? 'page/p1' : '/page/p1'}`,
          type: 'AnnotationPage',
          items: flat.map(a => toIIIFAnnotation(canvasItem.id, toImageAnnotation(a)))
        }]
      }))
    }

    return new Response(
      JSON.stringify(derivative),
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } else {
    const manifest = await fetch(room.iiif_content).then(res => res.json()) as any;

    const v3 = room.major_version === 3
        ? manifest
        : convertPresentation2(manifest);

    const derivative = {
      ...v3,
      items: (v3.items || []).map((canvasItem: any) => {
        const pageId = `page/p${(canvasItem.annotations || []).length + 1}`;

        return {
          ...canvasItem,
          annotations: [
            ...(canvasItem.annotations || []),
            {
              id: `${canvasItem.id}${canvasItem.id.endsWith('/') ? pageId : `/${pageId}`}`,
              type: 'AnnotationPage',
              items: [
                ...Array.from(annotations.get(canvasItem.id) || [])
                  .map(([_, a]) => toIIIFAnnotation(canvasItem.id, toImageAnnotation(a)))
              ]
            }
          ]
        };
      })
    };

    return new Response(
      JSON.stringify(derivative),
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}