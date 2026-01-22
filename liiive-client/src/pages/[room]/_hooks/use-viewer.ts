import type OpenSeadragon from 'openseadragon';
import { create } from 'zustand';

interface ViewerState {

  viewer?: OpenSeadragon.Viewer;

  setViewer(viewer?: OpenSeadragon.Viewer): void;

}

export const useViewer = create<ViewerState>(set => ({

  viewer: undefined,

  setViewer: viewer => set({ viewer })

}));