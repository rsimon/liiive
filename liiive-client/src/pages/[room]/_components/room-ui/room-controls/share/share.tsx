import { useCallback, useState } from 'react';
import { Check, Clipboard, LockKeyhole, Users } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../../../../../../shadcn/button';
import { Input } from '../../../../../../shadcn/input';
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '../../../../../../shadcn/popover';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../../../../shadcn/tooltip';
import { AnimatedGlow } from '../../../../../../components/animated-glow';
import { LiiiveLogo } from '../../../../../../components/liiive-logo';
import type { IIIFContent, Room } from '../../../../../../types';
import { PartyPopper } from './party-popper';

interface ShareProps {

  readOnly: boolean;

  room: Room;

  iiifContent?: IIIFContent;

}

export const Share = (props: ShareProps) => {

  const { room } = props;

  const [isCopied, setIsCopied] = useState(false);

  const onCopyToClipboard = useCallback(() => {
    try {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    } catch (error) {
      console.error('Failed to copy URL', error);
    }
  }, []);

  const roomURL = window.location.origin + window.location.pathname;

  const hasManifest = !room.time_limit_hours;

  return props.readOnly ? (
    <a href="/" className="leading-1 mb-0.75">
      <LiiiveLogo className="pl-4 pr-1.5 text-xl text-(--iiif-blue) font-bold" />
    </a>
  ) : (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            {room.is_readonly ? (
              <Button>
                <LockKeyhole strokeWidth={1.7} className="mb-0.5" />
                Read-Only
              </Button>
            ) : (
              <Button>
                <Users strokeWidth={1.7} />
                Share
              </Button>
            )}
          </PopoverTrigger>
        </TooltipTrigger>

        <PopoverContent
          align="start"
          alignOffset={-2}
          className="rounded-lg w-md shadow-lg border-black/10 text-sm relative p-0"
          sideOffset={6}
          onOpenAutoFocus={evt => evt.preventDefault()}>
          <PopoverArrow className="fill-white drop-shadow-xs -translate-y-px" width={16} height={8} />

          <div className="absolute top-0 w-full h-full opacity-30 overflow-hidden rounded-lg pointer-events-none">
            <div>
              <AnimatedGlow duration={12} />
            </div>
          </div>

          {room.is_readonly ? (
            <aside className="p-4">
              <div className="leading-relaxed px-0.5">
                This room is read-only and editable only to you.
              </div>
            </aside>
          ) : (
            <aside className="p-4">
              <div className="pb-5 leading-relaxed px-0.5">
                <h3 className="font-bold pb-1.5 flex gap-1.5 items-center">
                  <div className="w-7 h-7 flex mb-2">
                    <PartyPopper 
                      className="w-7 h-7"/> 
                  </div>
                  <div>Annotate Together!</div>
                </h3>

                <p>
                  This room is public. Anyone with the link can join. Copy the URL 
                  below to start collaborating in real-time.
                </p>
              </div>

              <div className="relative">
                <Input 
                  readOnly
                  className="bg-white border border-none rounded-md text-primary"
                  value={roomURL} />

                <Button 
                  variant="ghost"
                  className="absolute bg-white hover:bg-white/60 rounded-l-none rounded-r-md right-0 top-0 h-9"
                  onClick={onCopyToClipboard}>
                  <Clipboard 
                    strokeWidth={1.7}
                    className={clsx('absolute transition-all duration-200 ease-in-out', isCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100')} />

                  <Check 
                    className={clsx('absolute text-green-600 transition-all duration-200 ease-in-out', isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75')} />
                </Button>
              </div>
              
              {hasManifest && (
                <div className="pt-3.5 text-muted-foreground px-0.5 text-center">
                  <p>
                    Use the <a 
                      className="hover:text-popover-foreground underline" 
                      href={`${roomURL}/manifest`}>IIIF 
                    Manifest</a> to open this room in other viewers. 
                  </p>
                </div>
              )}
            </aside>
          )}
        </PopoverContent>

        <TooltipContent>
          Share access to this image and annotations
        </TooltipContent>
      </Tooltip>
    </Popover>
  )

}