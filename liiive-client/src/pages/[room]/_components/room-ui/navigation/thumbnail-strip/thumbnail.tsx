import { useCallback, useMemo, useRef} from 'react';
import type { Annotation, Canvas } from 'manifesto.js';
import { MessagesSquare } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import clsx from 'clsx';
import type { PresentUser } from '../../../../../../types';
import { Avatar } from '../../../../../../components/avatar';
import { ThumbnailImage } from './thumbnail-image';

import './thumbnail.css';

interface ThumbnailProps {

  annotationCount: number;

  canvas: Canvas;

  isCurrent: boolean;

  size: number;

  users: PresentUser[];

  onClick(event: React.MouseEvent): void;

}

const CLICK_TIME_THRESHOLD = 200;

const isLevel0 = (image: Annotation) => {
  const services = image.getServices();

  if (services.length === 0) return true;

  const profile = services[0].getProfile();
  return profile.toLowerCase().includes('level0');
}

export const Thumbnail = (props: ThumbnailProps) => {

  const { canvas, isCurrent, size } = props;

  const clickStartTime = useRef(0);

  const { src, label } = useMemo(() => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    const aspect = width / height;

    const isPortrait = aspect < 1;

    const h = Math.ceil(isPortrait ? size / aspect : size);
    const w = Math.ceil(isPortrait ? size : size / aspect);

    const label = canvas.getDefaultLabel();

    const firstImage: Annotation = [...canvas.imageResources, ...canvas.iiifImageResources][0];

    if (isLevel0(firstImage)) {
      return {
        src: firstImage.id,
        w, h, label
      }
    } else {
      const uri = firstImage.getServices()[0] ? firstImage.getServices()[0].id : firstImage.id;
      const src = `${uri.endsWith('/') ? uri : `${uri}/`}full/${w * 2},${h * 2}/0/default.jpg`;
      return { src, w, h, label };
    }
  }, [canvas, size]);

  const onPointerDown = useCallback(() => {
    clickStartTime.current = Date.now();
  }, []);

  const onClick = useCallback((evt: React.MouseEvent) => {
    const clickDuration = Date.now() - clickStartTime.current;
    
    if (clickDuration > CLICK_TIME_THRESHOLD) {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }
    
    props.onClick?.(evt);
  }, [props.onClick]);

  return (
    <div className="thumbnail h-full flex items-center justify-start px-1">
      <div className="flex flex-col items-center gap-1">
        <button 
          className={clsx(isCurrent ? 'ring-[3px] ring-black ring-offset-2' : undefined, 'relative cursor-pointer overflow-hidden rounded shadow-xs')}
          style={{ width: size, height: size }}
          onPointerDown={onPointerDown}
          onClick={onClick}>
          
          <ThumbnailImage 
            alt={label || undefined}
            src={src} />

          {props.users.length > 0 && (
            <div className="absolute top-1 right-1 flex -space-x-2.5">
              {props.users.map(user => (
                <Avatar 
                  key={user.id}
                  className="h-6 w-6 border-2 shadow-sm"
                  user={user} />
              ))}
            </div>
          )}

          <div className="thumbnail-annotation-count px-2.5 py-1 w-full h-12 absolute bottom-0 left-0 text-white flex items-end justify-end pointer-events-none">
            {props.annotationCount > 0 && (
              <div className="flex gap-1 text-sm">
                <MessagesSquare className="h-4 w-4 mb-0.5" /> 
                <NumberFlow value={props.annotationCount} />
              </div>
            )}
          </div>
        </button>

        <span className="text-xs max-w-20 whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </span>
      </div>
    </div>
  )

}