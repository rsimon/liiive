import { motion } from 'framer-motion';

const IIIF_RED = '#ee2535';
const IIIF_BLUE = '#0275a5';

import './animated-glow.css';

interface AnimatedGlowProps {

  className?: string;

  duration?: number;

}

export const AnimatedGlow = (props: AnimatedGlowProps) => {

  const duration = props.duration || 20;

  return (
    <div className={`animated-glow-wrapper${props.className ? ` ${props.className}` : ''}`}>
      <motion.div
        className="animated-glow"
        animate={{
          rotate: ['-8deg', '8deg'],
          width: ['720px', '340px'],
          background: [
            `linear-gradient(90deg, ${IIIF_RED} 0%, ${IIIF_BLUE} 100%)`,
            `linear-gradient(90deg, ${IIIF_BLUE} 0%, ${IIIF_RED} 80%)`,
            `linear-gradient(90deg, ${IIIF_RED} 80%, ${IIIF_BLUE} 0%)`,
            `linear-gradient(90deg, ${IIIF_BLUE} 100%, ${IIIF_RED} 0%)`
          ]
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />
    </div>
  )
  
}