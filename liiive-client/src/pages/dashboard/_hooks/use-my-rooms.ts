import { useCallback, useEffect, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import type { User } from '@annotorious/core';
import { useClaimableRooms } from '../../../hooks/use-claimableRooms';
import { supabase } from '../../../supabase';
import type { AccessedRoom, RoomRecord } from '../../../types';

const reviveRoom = (record: any): AccessedRoom => {
  const { created, owner, owner_name, owner_avatar, last_accessed, permission, ...rest } = record;
            
  return {
    ...rest,
    created: new Date(created),
    owner: owner ? { id: owner, name: owner_name, avatar: owner_avatar } : undefined,
    last_accessed: last_accessed ? new Date(last_accessed) : undefined,
    permission
  }
}

const claimRoom = (
  roomId: string, 
  userId: string
) => supabase.rpc('access_room', { room: roomId })
  .then(() => supabase.from('room')
    // RLS will enforce that this matches logged-in user ID!
    .update({ 
      owner: userId,
      time_limit_hours: 24 
    })
    .eq('id', roomId)
    .select()
    .returns<RoomRecord[]>()
    .single()
  );

export const useMyRooms = (me?: User) => {

  const { clearCurrentClaim, getCurrentClaim } = useClaimableRooms();

  const [pendingClaim, setPendingClaim] = useState<string | null>(() => getCurrentClaim());

  const [claimedRoom, setClaimedRoom] = useState<RoomRecord | undefined>();

  const [claimError, setClaimError] = useState<PostgrestError | undefined>();

  const [loading, setLoading] = useState(true);

  const [rooms, setRooms] = useState<AccessedRoom[]>([]);

  useEffect(() => {
    if (!me) return;

    // Resolve pending claim first, if any
    const resolveClaim = () => new Promise<void>(resolve => {
      if (pendingClaim) {
        claimRoom(pendingClaim, me.id).then(({ error, data }) => {
          if (error || !data) {
            console.error(`Error claiming room ${pendingClaim}`);
            console.error(error);
            setClaimError(error);
          } else {
            clearCurrentClaim();
            setClaimedRoom(data);
          }

          setPendingClaim(null)
          resolve();
        });
      } else {
        resolve();
      }
    });

    resolveClaim().then(() => {
      supabase.rpc('list_my_rooms').then(({ data, error}) => {
        setLoading(false);

        if (error || !data) {
          console.error(error);
        } else {
          const revived: AccessedRoom[] = data.map(reviveRoom).sort((a: AccessedRoom, b: AccessedRoom) => {
            if (a.last_accessed && b.last_accessed)
              return b.last_accessed.getTime() - a.last_accessed.getTime()
            else
              return a.last_accessed ? 1 : -1;
          });
          
          setRooms(revived);
        }
      });
    });
  }, [me?.id]);

  const deleteRoom = useCallback((room: AccessedRoom) => {
    const current = [...rooms];

    // Optimistic update
    setRooms(current => current.filter(r => r.id !== room.id));
    supabase
      .from('room')
      .delete()
      .eq('id', room.id)
      .then(({ error }) => {
        if (error) setRooms(current);
      });
  }, [rooms]);

  const removeVisitedRoom = useCallback((room: AccessedRoom) => {
    const current = [...rooms];

    // Optimistic update
    setRooms(current => current.filter(r => r.id !== room.id));
    supabase
      .from('room_access')
      .delete()
      .eq('room_id', room.id)
      .then(({ error }) => {
        if (error) setRooms(current);
      })
  }, []);

  const changeReadOnly = useCallback((room: AccessedRoom, is_readonly: boolean) => {
    supabase
      .from('room')
      .update({ is_readonly })
      .eq('id', room.id)
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          setRooms(current => current.map(r => r.id === room.id ? ({
            ...r,
            is_readonly
          }) : r));
        }
      });
  }, [rooms]);

  const changeTimeLimit = useCallback((room: AccessedRoom, value: 'permanent' | 'temporary') => {
    const time_limit_hours = value === 'permanent' ? undefined : 24;

    supabase
      .from('room')
      .update({ time_limit_hours: time_limit_hours || null })
      .eq('id', room.id)
      .select()
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else {
          setRooms(current => current.map(r => r.id === room.id ? ({
            ...r,
            time_limit_hours,
            expires_at: data.expires_at
          }) : r));
        }
      });
  }, [rooms]);

  return { claimedRoom, claimError, loading, pendingClaim, rooms, changeReadOnly, changeTimeLimit, deleteRoom, removeVisitedRoom };

}