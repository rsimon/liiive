import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '../../../../../../shadcn/skeleton';

interface ThumbnailImageProps {

  alt?: string;

  src: string;

}

export const ThumbnailImage = (props: ThumbnailImageProps) => {

  const { src } = props;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <AnimatePresence>
      {isLoaded ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full overflow-hidden">
          <img
            key="image"
            className="h-full w-full object-cover rounded hover:scale-105 border transition-transform"
            draggable={false}
            src={src} />

          <div className="thumbnail-shade w-full h-12 absolute bottom-0 left-0 pointer-events-none" />
        </motion.div>
      ) : (
        <motion.div
          key="skeleton"
          className="rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <Skeleton className="absolute w-full h-full top-0 left-0" />
        </motion.div>
      )}
    </AnimatePresence>
  )

}