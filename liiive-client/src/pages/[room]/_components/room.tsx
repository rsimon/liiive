import { useCallback, useEffect, useState } from 'react';
import { Annotorious, type User } from '@annotorious/react';
import { Hourglass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { supabase } from '../../../supabase';
import { getGuestUser, setDisplayName, type RememberSetting } from '../_utils';
import { useRoom } from '../_hooks';
import { LoadingOverlay } from './loading-overlay';
import { DisplayNamePrompt } from './display-name-prompt';
import { RoomUI } from './room-ui';

interface RoomProps {

  id: string;

}

export const Room = (props: RoomProps) => {

  const [isExpired, setIsExpired] = useState(false);

  const { 
    room, 
    loading: isRoomMetaLoading, 
    error: roomMetaError 
  } = useRoom(props.id, () => setIsExpired(true));

  const [manifestLoadError, setManifestLoadError] = useState<string | undefined>();

  const [manifestLoaded, setManifestLoaded] = useState(false);

  const [connected, setConnected] = useState(false);

  const [me, setMe] = useState<User | undefined>();

  useEffect(() => {
    supabase.auth.getUser().then(result => {  
      if (result.data?.user) {
        const { id, user_metadata } = result.data.user;

        setMe({
          id,
          avatar: user_metadata.avatar_url,
          name: user_metadata.name
        });
      } else {
        setMe(getGuestUser())
      }
    });
  }, []);

  const onSetDisplayName = useCallback((displayName: string | undefined, remember?: RememberSetting) => {
    if (!me || !displayName) return;

    const updated = setDisplayName(me, displayName, remember);
    setMe(updated);
  }, [me, setMe]);

  const isLoading = 
    isRoomMetaLoading || 
    !manifestLoaded ||
    !connected;

  const isFailed = 
    roomMetaError ||
    manifestLoadError;

  return isExpired ? (
    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-sm">
      <div className="flex items-center gap-1.5 text-red-700">
        <Hourglass className="size-3.5 mb-0.5" /> This room has expired
      </div>
    </div>
  ) : (
    <div className="h-full w-full bg-gray-200">
      {(room && me?.name) && (
        <Annotorious>
          <RoomUI 
            me={me}
            room={room} 
            onManifestLoadError={setManifestLoadError}
            onManifestLoaded={() => setManifestLoaded(true)}
            onConnected={() => setConnected(true)} 
            onChangeDisplayName={onSetDisplayName}/>
        </Annotorious>
      )}

      <AnimatePresence initial={false}>
        {(isLoading || isFailed) && (
          <motion.div 
            className={clsx(me?.name ? 'bg-gray-200/80 backdrop-blur-xs' : undefined, 'absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm z-50')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <LoadingOverlay 
              loading={isRoomMetaLoading || !manifestLoaded} 
              connecting={!connected}
              error={roomMetaError || manifestLoadError} />
          </motion.div>
        )}
      </AnimatePresence>

      {me && (
        <DisplayNamePrompt 
          open={!me.name}
          onClose={onSetDisplayName} />
      )}
    </div>
  )

}