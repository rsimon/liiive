import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import type { User } from '@annotorious/core';
import type { UserAwarenessState } from '../types';

export const getUserColor = (user: User, others?: UserAwarenessState[]) => {
  // Dicebear computes a visually nice, high-contrast color for the avatar.
  const avatar = createAvatar(initials, {
    seed: user.name
  });

  return avatar.toJson().extra.primaryBackgroundColor as string;

}