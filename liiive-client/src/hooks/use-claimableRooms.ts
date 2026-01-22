import { useCallback } from 'react';
import type { AccessedRoom, Room } from '../types';

const CLAIMABLE_ROOMS_KEY = 'liiive:claimable-rooms';

const CLAIM_KEY = 'liiive:claim';

const _loadClaimableRooms = (): AccessedRoom[] => {
  const str = localStorage.getItem(CLAIMABLE_ROOMS_KEY);

  const visited = str ? JSON.parse(str) as AccessedRoom[] : [];  

  // 24 hours ago
  const threshold = new Date(Date.now() - 24 * 3600 * 1000);

  const purged = visited.filter(room => {
    // Should never happen, but just in case
    if (!room.created) return false;

    const roomCreated = new Date(room.created);
    return roomCreated > threshold;
  });

  if (visited.length !== purged.length)
    localStorage.setItem(CLAIMABLE_ROOMS_KEY, JSON.stringify(purged));

  if (purged.length === 0)
    localStorage.removeItem(CLAIMABLE_ROOMS_KEY)

  return purged;
}

export const useClaimableRooms = () => {

  const loadClaimableRooms = useCallback(() => {
    try {
      return _loadClaimableRooms();
    } catch (error) {
      console.error('Error loading claimable rooms');
      console.error(error);
      return [];
    }
  }, []);

  const createClaimableRoom = useCallback((room: Room) => {
    try {
      const current = _loadClaimableRooms();
      const next = [...current, { ...room, last_accessed: new Date().toISOString() }];
      
      localStorage.setItem(CLAIMABLE_ROOMS_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Error saving claimable room');
      console.error(error);
    }
  }, []);

  const getCurrentClaim = useCallback(() => {
    return localStorage.getItem(CLAIM_KEY);
  }, []);

  const setCurrentClaim = useCallback((roomId: string) => {
    localStorage.setItem(CLAIM_KEY, roomId);
  }, []);

  const clearCurrentClaim = useCallback(() => {
    localStorage.removeItem(CLAIM_KEY);
  }, [])

  return { 
    clearCurrentClaim, 
    createClaimableRoom, 
    getCurrentClaim, 
    loadClaimableRooms,
    setCurrentClaim 
  };

}