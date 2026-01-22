
import { useEffect, useState } from 'react';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { ydoc } from './use-annotation-store';

const HOCUSPOCUS_URL = import.meta.env.PUBLIC_HOCUSPOCUS_URL;

const DISABLE_MULTIPLAYER = import.meta.env.PUBLIC_DISABLE_MULTIPLAYER;

export const useHocuspocus = (roomId: string, userId: string) => {

  if (DISABLE_MULTIPLAYER) return { connected: true, provider: undefined };

  const [provider, setProvider] = useState<HocuspocusProvider | undefined>();

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !userId) return;

    const provider = new HocuspocusProvider({
      url: HOCUSPOCUS_URL,
      name: roomId,
      document: ydoc,
      onConnect() {
        // setConnected(true)
      },
      onSynced() {
        setConnected(true);
      },
      onStateless(data) {
        // console.log('onstatless', data)
      }
    });
    
    setProvider(provider);

    provider.on('unsyncedChanges', (n: number) => {
      // console.log('Number of changes to send to server:', n);
    });

    return () => {
      provider.destroy();
      setProvider(undefined);
    }
  }, [roomId, userId]);

  return { connected, provider };

}