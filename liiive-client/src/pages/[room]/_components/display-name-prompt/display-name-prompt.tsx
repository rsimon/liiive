import { useState } from 'react';
import { LiiiveLogo } from '../../../../components';
import { Button } from '../../../../shadcn/button';
import { Checkbox } from '../../../../shadcn/checkbox';
import { Input } from '../../../../shadcn/input';
import type { RememberSetting } from '../../_utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../../../shadcn/dialog';

interface DisplayNamePromptProps {

  open: boolean;

  onClose(name: string | undefined, remember: RememberSetting): void;

}

export const DisplayNamePrompt = (props: DisplayNamePromptProps) => {

  const [name, setName] = useState('');

  const [remember, setRemember] = useState<RememberSetting>('dont_remember');

  const onClose = () => props.onClose(name, remember);
  
  return (
    <Dialog open={props.open}>
      <DialogContent className="max-w-lg pb-5">
        <DialogHeader>
          <DialogTitle className="leading-relaxed pb-2">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <LiiiveLogo className="text-3xl text-iiif-blue" />
            </a>
            <p className="font-medium text-sm tracking-wide">
              Real-time collaboration for IIIF image collections.
            </p>
          </DialogTitle>
        
          <DialogDescription className="pt-2 space-y-3 leading-relaxed" asChild>
            <p>
              You are about to join this session as a <strong className="font-semibold text-primary">Guest</strong>. Other participants
              will see your cursor movements and any annotations that you make.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-primary">
          <p className="font-semibold">
            Pick a display name - this is how others will see you in the room:
          </p>

          <Input 
            className="w-full border bg-muted text-primary"
            placeholder="Enter your display name..."
            aria-label="Your display name"
            value={name}
            onChange={evt => setName(evt.target.value)} />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="border border-gray-300 bg-muted"
              checked={remember === 'remember'}
              onCheckedChange={e => setRemember(e ? 'remember' : 'dont_remember')} />
            
            <label htmlFor="remember" className="text-muted-foreground">
              Remember my name for future sessions
            </label>
          </div>

          <div className="pt-5 pb-1">
            <Button 
              disabled={!name}
              className="rounded-md px-8 w-full"
              onClick={onClose}>
              Join Session
            </Button>
          </div>

          <div className="border-t text-muted-foreground text-center pt-4 tracking-wide">
            <p>
              Already have an account? <a 
              href={`/sign-in/?redirect=${window.location.pathname}`} 
              className="text-sky-700 hover:underline">Sign in</a>.
              New to liiive? <a href="/" target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">Learn more</a>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

}