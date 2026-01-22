import { useEffect, useState } from 'react';
import { ScanText } from 'lucide-react';
import { TooltipToggle } from '../../_shared';
import { useXRayMode } from './use-x-ray-mode';

import './x-ray-mode.css';

export const XRayMode = () => {

  const { setXRayMode } = useXRayMode();

  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    setXRayMode(pressed);
  }, [pressed]);

  return (
    <TooltipToggle
      tooltip="X-Ray Mode"
      pressed={pressed}
      onPressedChange={setPressed}>
      <ScanText
        strokeWidth={1.8}
        className="size-4" />
    </TooltipToggle>
  )

}