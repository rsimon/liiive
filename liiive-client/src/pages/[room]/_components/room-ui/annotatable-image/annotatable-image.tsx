import { useCallback, useEffect, useMemo } from 'react';
import { Canvas, Service } from 'manifesto.js';
import type { CanvasKeyEvent } from 'openseadragon';
import { mountPlugin as ToolsPlugin } from '@annotorious/plugin-tools';
import { mountPlugin as SmartScissorsPlugin } from '@annotorious/plugin-magnetic-outline';
import type { IIIFImage, Room, UserAwarenessState } from '../../../../../types';
import { AnnotationPopup } from '../annotation-popup';
import {
  useRoomUIState, 
  useViewer as useZustandViewer
} from '../../../_hooks';
import { 
  AnnotoriousPlugin,
  OpenSeadragonAnnotationPopup, 
  OpenSeadragonAnnotator, 
  OpenSeadragonViewer, 
  useViewer as useAnnotoriousViewer,
  UserSelectAction,
  type AnnotationState,
  type DrawingStyle,
  type DrawingStyleExpression,
  type ImageAnnotation,
  type User
} from '@annotorious/react';

import '@annotorious/openseadragon/annotorious-openseadragon.css';
import '@annotorious/plugin-tools/annotorious-plugin-tools.css';
import '@annotorious/plugin-magnetic-outline/plugin-magnetic-polyline.css';

interface AnnotatableImageProps {

  content: Canvas | IIIFImage;

  me: User;

  readOnly: boolean;

  room: Room;

  presence: Record<string, UserAwarenessState[]>;

}

const ViewerProvider = () => {

  const viewer = useAnnotoriousViewer();

  const setViewer = useZustandViewer(state => state.setViewer);

  useEffect(() => { 
    setViewer(viewer);

    if (viewer) {
      const onCanvasKey = (e: CanvasKeyEvent) => {
        const event = e.originalEvent as KeyboardEvent;
        if (event.key === 'f')
          e.preventDefaultAction = true;
      }

      viewer.addHandler('canvas-key', onCanvasKey);

      return () => {
        viewer.removeHandler('canvas-key', onCanvasKey);
      }
    }
   }, [viewer, setViewer]);

  return null;
}

const getImageService = (services: Service[]) => {
  const imageService = services.find(s => {
    const type = s.__jsonld.type || s.__jsonld['@type'];
    return typeof type === 'string' && type.includes('ImageService');
  });
  
  return imageService || services[0];
}

const normalizeServiceURI = (uri: string) =>
  uri.endsWith('/info.json') ? uri : `${uri.endsWith('/') ? uri : `${uri}/`}info.json`;

const getTileSourceForCanvas = (canvas: Canvas) => {
  const firstImageResource = [...canvas.iiifImageResources, ...canvas.imageResources][0];
  if (firstImageResource) {
    const resource = 'getResource' in firstImageResource ? firstImageResource.getResource() : firstImageResource;

    if (resource.getServices().length > 0) {
      return normalizeServiceURI(getImageService(resource.getServices()).id);
    } else {
      // Plain image tilesource
      return {
        type: 'image',
        url: resource.id
      }
    }
  } else {
    const firstImage = canvas.getImages()[0];
    if (firstImage) {
      const resource = firstImage.getResource();

      if (resource) {
        if (resource.getServices().length > 0) {
          return normalizeServiceURI(resource.getServices()[0].id);
        } else {
          // Plain JPEG tilesource
          return {
            type: 'image',
            url: resource.id
          }
        }
      }
    }
  }
}

const getTileSourceForImage = (image: IIIFImage) => {
  return image.url;
}

export const AnnotatableImage = (props: AnnotatableImageProps) => {

  const { content, me, readOnly, room, presence } = props;

  const isDrawingEnabled = useRoomUIState(state => state.drawingEnabled); 

  const tool = useRoomUIState(state => state.tool); 

  const isEditorOpen = useRoomUIState(state => state.isEditorOpen);

  const tileSources = useMemo(() => {
    return content instanceof Canvas 
      ? getTileSourceForCanvas(content) : getTileSourceForImage(content);
  }, [content]);

  const OSD_OPTIONS: OpenSeadragon.Options = useMemo(() => ({
    prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@3.1/build/openseadragon/images/',
    tileSources,
    crossOriginPolicy: 'Anonymous',
    showNavigationControl: false,
    gestureSettingsMouse: {
      clickToZoom: false
    }
  }), [tileSources]);

  const style = useMemo(() => {
    const usersOnThisCanvas = presence[content.id] || [];

    // Map: selected annotation -> user
    const selections = usersOnThisCanvas.reduce<Record<string, UserAwarenessState[]>>((agg, user) => {
      const userSelection = user.selected || [];

      userSelection.forEach(annotationId => {
        if (!agg[annotationId])
          agg[annotationId] = [user];
        else
          agg[annotationId] = [...agg[annotationId], user]
      });

      return agg;
    }, {});

    const selectionStyle = (a: ImageAnnotation, state: AnnotationState) => {
      const isSelectedBy = selections[a.id] || [];

      return isSelectedBy.length > 0 ? {
        stroke: isSelectedBy[0].color,
        strokeWidth: 3
      } as DrawingStyle : {
        fillOpacity: state?.hovered ? 0.35 : 0.2,
      };
    };

    return selectionStyle as DrawingStyleExpression;
  }, [content.id, presence]);

  const selectAction = useCallback(() => {
    return props.readOnly ? UserSelectAction.SELECT : UserSelectAction.EDIT;
  }, [props.readOnly]);

  return (
    <OpenSeadragonAnnotator
      drawingEnabled={isDrawingEnabled}
      tool={tool !== 'move' ? tool : 'rectangle'}
      drawingMode="drag"
      modalSelect={isEditorOpen}
      style={style}
      user={props.me}
      userSelectAction={selectAction}>

      <OpenSeadragonViewer 
        className="h-full w-full"
        options={OSD_OPTIONS} />

      <AnnotoriousPlugin
        plugin={ToolsPlugin} />

      <AnnotoriousPlugin
        plugin={SmartScissorsPlugin} />

      <ViewerProvider />

      <OpenSeadragonAnnotationPopup
        arrow
        arrowProps={{
          fill: '#ffffff'
        }}
        placement="bottom-start"
        popup={props => (
          <AnnotationPopup
            {...props}
            me={me} 
            readOnly={readOnly}
            room={room} />
        )} />
    </OpenSeadragonAnnotator>
  )

}