import type { Room } from '../types';

export const getRemainingTime = (room: Room) => {
  const expiresAt = new Date(room.expires_at).getTime();

  const timeRemaining = expiresAt - new Date().getTime() + 59000;
  
  if (timeRemaining <= 0)
    return { hours: '0', minutes: '00' };

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  const formatTime = (time: number) => time.toString();

  return { hours: formatTime(hours), minutes: formatTime(minutes).padStart(2, '0') };
};