import { useLayoutEffect, useRef, useState } from 'react';

import './cursor.css';

interface CursorProps {

  color: string;

  name: string;

  isTyping: boolean;

  point: number[];

}

export const Cursor = (props: CursorProps) => {

  const ref = useRef<SVGSVGElement>(null);

  const [bbox, setBbox] = useState<DOMRect | undefined>();

  useLayoutEffect(() => {
    const { x, y, width, height } = (ref.current?.querySelector('.label') as SVGGElement)?.getBBox();
    setBbox(current => new DOMRect(x, y, Math.max(width, 420), Math.max(height, current?.height || 0)));
  }, [props.name, props.isTyping]);

  useLayoutEffect(() => {
    const [x, y] = props.point;
    ref.current?.style.setProperty('transform', `translate(${x}px, ${y}px)`);
  }, [props.point])

  return (
    <svg
      className="cursor h-4 w-4 cursor overflow-visible absolute"
      ref={ref}
      viewBox="0 0 220 220">
      <defs>
        <filter id="shadow-sm">
          <feDropShadow 
            dx={5} 
            dy={5} 
            stdDeviation={20} 
            floodOpacity={0.65} />
        </filter>
      </defs>
      <path
        fill={props.color}
        stroke="#ffffff"
        strokeWidth={12}
        filter="url(#shadow)"
        d="M 24.747436,5.3614479 C 16.872574,5.4001176 9.3178596,10.697179 6.6247979,18.102176 4.6430048,23.283205 5.0759177,29.24857 7.5160284,34.200579 30.924179,90.550057 54.335476,146.89845 77.770073,203.2368 c 3.212412,7.14531 11.069064,11.87489 18.887384,11.36365 7.649133,-0.33999 14.914213,-5.56591 17.426903,-12.83931 0.93615,-2.5579 1.53983,-5.17778 2.35102,-7.76445 5.05051,-17.22896 10.09678,-34.45916 15.13893,-51.69057 21.20194,-4.20867 42.41007,-8.38932 63.60269,-12.64254 7.66161,-1.91131 13.75137,-8.8893 14.58017,-16.74671 0.95515,-7.58127 -2.9421,-15.607827 -9.65748,-19.332079 -2.74931,-1.576475 -5.627,-2.912788 -8.41513,-4.417689 C 138.89305,61.826165 86.103726,34.480203 33.299393,7.1645211 30.632957,5.9284774 27.684228,5.3205185 24.747436,5.3614479 Z" />

      <g>
        {bbox && (
          <rect 
            x={200} 
            y={220} 
            rx={40}
            height={bbox.height + 80}
            width={bbox.width + 160} 
            fill={props.color} />
        )}

        {props.isTyping ? (
          <g 
            className="label" 
            transform={`translate(${150 + bbox!.width / 2}, ${260 + bbox!.height / 2})`}>
            <circle className="typing-dot" cx="0" cy="0" r="30" fill="#fff" />
            <circle className="typing-dot" cx="120" cy="0" r="30" fill="#fff" />
            <circle className="typing-dot" cx="240" cy="0" r="30" fill="#fff" />
          </g>
        ) : (
          <text className="label" fontSize={180} x={275} y={440} fill="#ffffff">
            {props.name}
          </text>
        )}
      </g>
    </svg>
  )

}