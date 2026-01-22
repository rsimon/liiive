import { useCallback, useEffect, useState } from 'react';
import { dequal } from 'dequal/lite';
import pDebounce from 'p-debounce';
import type { HocuspocusProvider } from '@hocuspocus/provider';
import { useSelection, type User } from '@annotorious/react';
import OpenSeadragon from 'openseadragon';
import type { Cursor, UserAwarenessState } from '../../../types';
import { getUserColor } from '../../../utils/get-user-color';
import { useRoomUIState } from './use-room-ui-state';
import { useViewer } from './use-viewer';

export const useAwareness = (me: User, provider?: HocuspocusProvider, canvasId?: string) => {

  const viewer = useViewer(state => state.viewer);

  const [cursors, setCursors] = useState<Cursor[]>([]);

  // User states by canvas ID
  const [presence, setPresence] = useState<Record<string, UserAwarenessState[]>>({});

  const { selected } = useSelection();

  const isTyping = useRoomUIState(state => state.isTyping);

  const getPresenceByCanvas = useCallback(() => {
    if (!provider?.awareness) return {};

    const awarenessStates = provider.awareness.states as Map<number, UserAwarenessState>;

    // Awareness states, de-duplicated by user. Note that users may be 
    // connected through multiple tabs!
    // - Never show my own presence/cursor from another tab
    // - Only keep latest presence/cursor info from other users
    const userStates = [...awarenessStates.values()].reduce<UserAwarenessState[]>((distinct, state) => {
      // Ignore my own state
      if (state.id === me.id) return distinct;

      const existing = distinct.find(s => s.id === state.id);
      if (existing) {
        // Same user present multiple times? Keep only latest state
        return existing.timestamp > state.timestamp 
          ? distinct : [...distinct.filter(s => s !== existing), state];
      } else {
        return [...distinct, state];
      }
    }, []);

    // Distinct user states by canvas
    return userStates.reduce<Record<string, UserAwarenessState[]>>((map, state) => {
      if (!map[state.canvas])
        map[state.canvas] = [];
      
      map[state.canvas].push(state);

      return map;
    }, {}); 
  }, [provider, me]);

  const getCursors = useCallback((users: UserAwarenessState[]) => (
    users.filter(s => s.cursor).map(state => ({
      color: state.color,
      name: state.name!,
      pos: state.cursor!,
      typing: state.isTyping
    }))
  ), []);

  /**
   * Initial setup
   */
  useEffect(() => {
    if (!provider || !viewer?.element || !canvasId) return;

    // Broadcast my cursor position (in image coordinates)
    const onPointerMove = pDebounce((event: PointerEvent) => {
      const { clientX, clientY } = event;

      const { x, y } = viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(clientX, clientY));

      provider.setAwarenessField('cursor', [Math.round(x), Math.round(y)]);
      provider.setAwarenessField('timestamp', new Date());
    }, 5);

    document.documentElement.addEventListener('pointermove', onPointerMove);

    // Listen to awareness events
    const onAwarenessChange = () => setPresence(current => {
      // This ensures we don't update awareness state if e.g. only our own
      // mouse pos changes, which would cause unecessary re-renders.
      const next = getPresenceByCanvas();
      return dequal(current, next) ? current : next;
    });
    
    provider.on('awarenessUpdate', onAwarenessChange);

    // Broadcast my initial state
    const initialState: Partial<UserAwarenessState> = {
      canvas: canvasId,
      color: getUserColor(me),
      id: me.id,
      avatar: me.avatar,
      name: me.name,
      timestamp: new Date().toISOString()
    };

    Object.entries(initialState).forEach(([key, val]) => 
      provider.setAwarenessField(key, val));

    return () => {
      document.documentElement.removeEventListener('pointermove', onPointerMove);
      provider.off('awarenessUpdate', onAwarenessChange);
    }
  }, [provider, canvasId, me, viewer, getPresenceByCanvas]);

  useEffect(() => {
    if (!canvasId) return;
    const usersOnThisCanvas = presence[canvasId] || [];
    setCursors(getCursors(usersOnThisCanvas));
  }, [canvasId, presence, getPresenceByCanvas, getCursors]);

  // Canvas change
  useEffect(() => {
    if (!provider || !canvasId) return;

    // Broadcast my own state
    provider.setAwarenessField('canvas', canvasId);
    provider.setAwarenessField('selected', null);
    provider.setAwarenessField('timestamp', new Date());
  }, [provider, canvasId]);

  // Selection
  useEffect(() => {
    if (!provider) return;
    
    if (selected.length === 0)
      provider.setAwarenessField('selected', null);
    else
      provider.setAwarenessField('selected', selected.map(s => s.annotation.id));

    provider.setAwarenessField('timestamp', new Date());
  }, [provider, selected.map(s => s.annotation.id).join('-')]);

  useEffect(() => {
    if (!provider || !canvasId) return;

    provider.setAwarenessField('isTyping', isTyping);
    provider.setAwarenessField('timestamp', new Date());
  }, [provider, canvasId, isTyping]);

  return { presence, cursors };

}