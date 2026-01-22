import type { User } from '@annotorious/core';
import { customAlphabet } from 'nanoid';

const USER_ID_KEY = 'liiive:userid';

const NICKNAME_KEY = 'liiive:nickname';

export const getGuestUser = (): User => {
  const storedNickname = localStorage.getItem(NICKNAME_KEY);

  const storedId = localStorage.getItem(USER_ID_KEY);
  if (storedId)
    return { id: storedId, name: storedNickname || undefined, isGuest: true};

  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);
  const id = nanoid();

  localStorage.setItem(USER_ID_KEY, id);

  return { id, isGuest: true };
}

export type RememberSetting = 'remember' | 'dont_remember' | 'auto_detect';

export const setDisplayName = (user: User, updated: string, remember: RememberSetting = 'auto_detect'): User => {
  const shouldRember = 
    remember === 'remember' || 
    (remember === 'auto_detect' && Boolean(localStorage.getItem(NICKNAME_KEY)));

  if (shouldRember)
    localStorage.setItem(NICKNAME_KEY, updated);

  return { ...user, name: updated };
}