import { useAnnotator } from '@annotorious/react';
import type { AnnotoriousOpenSeadragonAnnotator } from '@annotorious/react';

export const useXRayMode = () => {

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const setXRayMode = (enabled: boolean) => {
    if (!anno) return;

    const container = anno.viewer.element?.querySelector('.openseadragon-canvas');
    if (!container) return;

    if (enabled) {
      const mask = document.createElement('DIV');
      mask.setAttribute('class', 'x-ray-mask');
      container.appendChild(mask);
    } else {
      const masks = Array.from(container.querySelectorAll('.x-ray-mask'));
      masks.forEach(m => m.remove());
    }
  }

  return { setXRayMode };

}