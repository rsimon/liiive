import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import type { AccessedRoom } from '../../../types';

export const useRoom = (roomId: string, onRoomDeleted?: () => void) => {

  const [loading, setLoading] = useState(true);

  const [room, setRoom] = useState<AccessedRoom | undefined>();

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    supabase
      .rpc('access_room', { room: roomId })
      .single()
      .then(({ data, error }) => {
        setLoading(false);

        if (!data || error) {
          console.error(error);
          setError(error?.message);
        } else {
          const { created, owner, owner_name, owner_avatar, last_accessed, permission, ...rest } = (data as any); 
          setRoom({
            ...rest,
            created: new Date(created),
            last_accessed: last_accessed ? new Date(last_accessed) : undefined,
            owner: owner ? { id: owner, name: owner_name, avatar: owner_avatar } : undefined
          });
        }
      });

    const channel = supabase
      .channel('room')
      .on(
        'postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'room', filter: `id=eq.${roomId}` }, 
        () => onRoomDeleted && onRoomDeleted()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    }
  }, [roomId]);

  return { room, loading, error };

}