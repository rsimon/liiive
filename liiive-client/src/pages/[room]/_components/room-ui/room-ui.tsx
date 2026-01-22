import { useEffect, useMemo } from 'react';
import type { Canvas } from 'manifesto.js';
import type { User } from '@annotorious/core';
import { TooltipProvider } from '../../../../shadcn/tooltip';
import { useAwareness, useIIIFContent } from '../../_hooks';
import { useHocuspocus } from '../../_hooks/use-hocuspocus';
import type { IIIFImage, Room } from '../../../../types';
import { AnnotatableImage } from './annotatable-image';
import { AnnotationStoreAdapter } from './annotation-store-adapter';
import { LiveCursors } from './live-cursors';
import { Navigation } from './navigation';
import { ToolPanel } from './tool-panel';
import { RoomControls } from './room-controls';
import { KeyboardShortcuts } from './keyboard-shortcuts';

interface RoomUIProps {

  me: User;
  
  room: Room;

  onManifestLoadError(error: string): void;

  onManifestLoaded(): void;

  onConnected(): void;

  onChangeDisplayName(name?: string): void;

}

export const RoomUI = (props: RoomUIProps) => {

  const { me, room } = props;

  const isReadOnlyForMe = useMemo(() => {
    // Room is public
    if (!room.is_readonly) return false;

    // Anonymous room, without owner (also public)
    if (!room.owner) return false;

    return room.owner.id !== me.id;
  }, [me, room]);

  const { 
    canvases,
    currentCanvas,
    error: manifestError,
    iiifContent,
    isLoading: isManifestLoading,
    onNext,
    onPrevious,
    setCurrentCanvas
  } = useIIIFContent(props.room.iiif_content);

  const current: Canvas | IIIFImage | undefined = useMemo(() => {
    if (currentCanvas) {
      return currentCanvas;
    } else if (iiifContent && iiifContent.type === 'IMAGE') {
      return iiifContent;
    }
  }, [iiifContent, currentCanvas]); 

  // Can be undefined, if live sync is disabled via .env var
  // const { connected, provider } = useLiveblocks(props.room.id, me.id);
  const { connected, provider } = useHocuspocus(props.room.id, me.id);

  const { presence, cursors } = useAwareness(me, provider, current?.id);

  useEffect(() => {
    if (manifestError) props.onManifestLoadError(manifestError);
  }, [manifestError]);

  useEffect(() => {
    if (!isManifestLoading) props.onManifestLoaded();
  }, [isManifestLoading]);

  useEffect(() => {
    if (connected) props.onConnected();
  }, [connected]);

  return (
    <TooltipProvider
      skipDelayDuration={0}>
      <div className="absolute top-0 left-0 h-full w-full bg-gray-200 text-3xl overflow-hidden pointer-events-none">
        <KeyboardShortcuts />
        
        {current && (
          <AnnotatableImage 
            content={current}
            me={me}
            readOnly={isReadOnlyForMe}
            room={props.room}
            presence={presence} />
        )}

        {(cursors.length > 0) && (
          <LiveCursors 
            cursors={cursors} />
        )}

        <RoomControls 
          me={props.me}
          readOnly={isReadOnlyForMe}
          room={props.room}
          current={current} 
          iiifContent={iiifContent} />

        <ToolPanel 
          readOnly={isReadOnlyForMe}
          me={props.me} 
          room={props.room}
          onChangeDisplayName={props.onChangeDisplayName} />
        
        <div className="absolute top-0 left-0 w-full h-full flex flex-col pointer-events-none">
          <div className="grow" />
          
          {(currentCanvas && iiifContent) && (
            <Navigation 
              canvases={canvases} 
              current={currentCanvas}
              iiifContent={iiifContent}
              presence={presence}
              onNext={onNext}
              onPrevious={onPrevious} 
              onGoTo={setCurrentCanvas} />
          )}
        </div>

        {current && (
          <AnnotationStoreAdapter 
            canvas={current} />
        )}
      </div>
    </TooltipProvider>
  )

}