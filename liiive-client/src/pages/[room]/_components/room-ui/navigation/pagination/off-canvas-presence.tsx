import { AnimatePresence, motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Avatar } from '../../../../../../components/avatar';
import { Button } from '../../../../../../shadcn/button';
import { Separator } from '../../../../../../shadcn/separator';
import type { PresentUser } from '../../../../../../types';

interface OffCanvasPresenceProps {

  after: PresentUser[];

  before: PresentUser[];

  onGoTo(canvasID: string): void;

}

export const OffCanvasPresence = (props: OffCanvasPresenceProps) => {

  const { after, before } = props;

  const onJumpToPrevUser = () => {
    if (before.length === 0) return;
    const { canvas } = before[before.length - 1];
    props.onGoTo(canvas);
  }

  const onJumpToNextUser = () => {
    if (after.length === 0) return;
    const { canvas } = after[0];
    props.onGoTo(canvas);
  }

  return (
    <div className="relative flex bg-white border shadow-lg rounded-full pointer-events-auto">
      {(before.length > 0) && (
        <Button 
          className={`flex items-center h-auto p-1 gap-0${after.length > 0 ? ' rounded-r-none' : ''}`}
          variant="ghost"
          onClick={onJumpToPrevUser}>
          <ChevronsLeft className="ml-0.5"/>

          <div className="flex item-center -space-x-2 ml-0.5">
            <AnimatePresence mode="popLayout">
              {before.map(user => (
                <motion.div 
                  layout
                  key={`${user.id}`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.5
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 1
                  }}>
                  <Avatar 
                    className="h-6 w-6 border border-white"
                    user={user} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Button>
      )}

      {(before.length > 0 && after.length > 0) && (
        <Separator 
          className="h-auto"
          orientation="horizontal" />
      )}

      {(after.length > 0) && (
        <Button
          className={`flex items-center h-auto p-1 gap-0${before.length > 0 ? ' rounded-l-none' : ''}`}
          variant="ghost"
          onClick={onJumpToNextUser}>
          <div className="flex items-center -space-x-2 mr-0.5">
            <AnimatePresence mode="popLayout">
              {after.map(user => (
                <motion.div 
                  layout
                  key={`${user.id}`}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.5
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 1
                  }}>
                  <Avatar 
                    className="h-6 w-6 border border-white"
                    user={user} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <ChevronsRight className="mr-0.5"/>
        </Button>
      )}
    </div>
  )

}