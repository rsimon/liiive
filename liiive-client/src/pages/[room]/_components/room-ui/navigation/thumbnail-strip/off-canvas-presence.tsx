import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../../../../../../shadcn/button';
import type { PresentUser } from '../../../../../../types';
import { Avatar } from '../../../../../../components/avatar';

interface OffCanvasPresenceProps {

  direction: 'after' | 'before';

  users: PresentUser[];

  onGoTo(canvasID: string): void;

}

export const OffCanvasPresence = (props: OffCanvasPresenceProps) => {

  const { direction, users } = props;

  const onJumpToUser = () => {
    if (users.length === 0) return;

    const { canvas } = direction === 'after' ? users[0] : users[users.length - 1];
    props.onGoTo(canvas);
  }

  return (
    <div className="pl-3">
      <AnimatePresence>
        {props.users.length > 0 && (
          <motion.div 
            className="relative flex bg-white border shadow-none rounded-full pointer-events-auto"
            initial={{ 
              opacity: 0,
              scale: 0.75
            }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            exit={{ 
              opacity: 0,
              scale: 0.75
            }}>
            <Button 
              variant="ghost"
              className="p-1 h-auto gap-0.5"
              onClick={onJumpToUser}>
              {props.direction === 'before' && (
                <ChevronsLeft />
              )}

              <div className="flex item-center -space-x-2">
                <AnimatePresence mode="popLayout">
                  {props.users.map(user => (
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

              {props.direction === 'after' && (
                <ChevronsRight className="p-0" />
              )} 
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

}