import { useCallback } from 'react';
import { FolderDown, ImageIcon, Images } from 'lucide-react';
import type { Canvas } from 'manifesto.js';
import { normalize, serialize, serializeConfigPresentation2 } from '@iiif/parser/presentation-3';
import { convertPresentation2  } from '@iiif/parser/presentation-2';
import { Button } from '../../../../../../shadcn/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../../shadcn/tooltip';
import { useAnnotationStore } from '../../../../_hooks';
import type { IIIFContent, IIIFImage } from '../../../../../../types';
import { downloadCanvas, toIIIFAnnotation, downloadJSON } from './utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuPortal, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger, 
  DropdownMenuTrigger 
} from '../../../../../../shadcn/dropdown-menu';

interface DownloadProps {

  current?: IIIFImage | Canvas;

  iiifContent?: IIIFContent;

}

export const Download = (props: DownloadProps) => {

  const store = useAnnotationStore();

  const onDownloadCanvas = useCallback(() => {
    if (props.current) {
      const { id } = props.current;
      const annotations = store.getAnnotations(id);
      downloadCanvas(id, annotations);
    }
  }, [store, props.current]);

  const onDownloadManifest = useCallback((version: 'v2' | 'v3') => () => {
    // Should never happen
    if (!props.iiifContent) return;
    
    // All processing is done in v3, so don't need different annotation serializations!
    const v3 = props.iiifContent.majorVersion === 3
      ? props.iiifContent.raw
      : convertPresentation2(props.iiifContent.raw);

    const derivativeV3 = {
      ...v3,
      items: v3.items.map((canvasItem: any) => {
        const pageId = `page/p${(canvasItem.annotations || []).length + 1}`;

        return {
          ...canvasItem,
          annotations: [
            ...(canvasItem.annotations || []),
            {
              id: `${canvasItem.id}${canvasItem.id.endsWith('/') ? pageId : `/${pageId}`}`,
              type: 'AnnotationPage',
              items: [

                ...store.getAnnotations(canvasItem.id).map(a => toIIIFAnnotation(canvasItem.id, a))
              ]
            }
          ]
        }
      })
    };

    if (version === 'v2') {
      const normalized = normalize({...derivativeV3 });
  
      const derivedV2 = serialize(
        {
          mapping: normalized.mapping,
          entities: normalized.entities,
          requests: {},
        },
        normalized.resource,
        serializeConfigPresentation2
      );

      console.log(derivativeV3, derivedV2);

      downloadJSON(derivedV2, 'manifest.json');
    } else {
      downloadJSON(derivativeV3, 'manifest.json');
    }      
  }, [store, props.iiifContent]);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon">
              <FolderDown strokeWidth={1.7} />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>

        <DropdownMenuContent
          align="start"
          alignOffset={-2}
          sideOffset={6}>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              IIIF
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onSelect={onDownloadCanvas}
                  disabled={!props.current}>
                  <ImageIcon /> Annotation list for this canvas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={onDownloadManifest('v2')}
                  disabled /* ={!props.iiifContent} */>
                  <Images /> Presentation API v2 manifest
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={onDownloadManifest('v3')}
                  disabled={!props.iiifContent}>
                  <Images /> Presentation API v3 manifest
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem disabled>
            Excel
          </DropdownMenuItem>
        </DropdownMenuContent>

        <TooltipContent>
          Export annotations
        </TooltipContent>
      </Tooltip>
    </DropdownMenu>
  )

}