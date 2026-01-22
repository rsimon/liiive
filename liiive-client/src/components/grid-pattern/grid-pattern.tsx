const DEFAULT_HEIGHT = 640;
const DEFAULT_SIZE = 40;
const DEFAULT_STROKE = '#c0d5ff';
const DEFAULT_WIDTH = 1920;

import './grid-pattern.css';

interface GridPatternProps {

  className?: string;

  height?: number; 

  size?: number;

  stroke?: string;
  
  width?: number;

}

export const GridPattern = (props: GridPatternProps) => {

  const height = props.height || DEFAULT_HEIGHT;

  const size = props.size || DEFAULT_SIZE;

  const stroke = props.stroke || DEFAULT_STROKE;

  const width = props.width || DEFAULT_WIDTH;

  return (
    <svg className="grid-pattern" width={width} height={height}>
      <defs>
        <pattern id="grid" width={size} height={size} patternUnits="userSpaceOnUse">
          <path d={`M ${size} 0 L 0 0 0 ${size}`} fill="none" stroke={stroke} strokeWidth={1} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )

}