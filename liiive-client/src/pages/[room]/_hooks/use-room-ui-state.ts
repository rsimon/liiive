import { create } from 'zustand';
import type { Tool } from '../../../types';

interface RoomUIState {

  drawingEnabled: boolean;

  isEditorOpen: boolean;

  setIsEditorOpen(open: boolean): void;

  isSearchOpen: boolean;

  setIsSearchOpen(open: boolean): void;

  isTyping: boolean;

  setIsTyping(isTyping: boolean): void;

  thumbnailsOpen: boolean;
  
  setThumbnailsOpen(isOpen: boolean): void;

  tool: Tool;

  setTool(tool: Tool): void;

}

export const useRoomUIState = create<RoomUIState>(set => ({

  drawingEnabled: false,

  isEditorOpen: false,

  setIsEditorOpen: isOpen => set({ isEditorOpen: isOpen }),

  isSearchOpen: false,

  setIsSearchOpen: isOpen => set({ isSearchOpen: isOpen }),

  isTyping: false,

  setIsTyping: isTyping => set({ isTyping }),

  thumbnailsOpen: false,
  
  setThumbnailsOpen: isOpen => set({ thumbnailsOpen: isOpen }),

  tool: 'move',

  setTool: tool => set({ tool, drawingEnabled: tool !== 'move' })

}));