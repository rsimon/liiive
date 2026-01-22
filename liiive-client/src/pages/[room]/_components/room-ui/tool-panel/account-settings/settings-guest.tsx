import { useCallback, useState } from 'react';
import { Check, CircleUser } from 'lucide-react';
import clsx from 'clsx';
import type { User } from '@annotorious/core';
import { Button } from '../../../../../../shadcn/button';
import { Input } from '../../../../../../shadcn/input';

interface SettingsGuestProps {

  me: User;

  onChangeDisplayName(name?: string): void;

}

export const SettingsGuest = (props: SettingsGuestProps) => {

  const [name, setName] = useState(props.me.name);

  const [saved, setSaved] = useState(false);

  const onUpdateName = useCallback(() => {
    props.onChangeDisplayName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [name, props.onChangeDisplayName]);

  return (
    <aside className="leading-relaxed p-2">
      <div className="pb-3 px-0.5">
        <h3 className="font-bold pb-0.5 flex gap-1.5 items-center">
          <CircleUser className="size-5 mb-1" strokeWidth={1.7} /> 
          <span>Guest</span>
        </h3>
        <p className="text-muted-foreground mt-1.5">
          You are not logged in. Other users in this room will see you as:
        </p>
      </div>

      <div className="relative my-1.5">
        <Input
          className="border bg-muted pr-10" 
          value={name} 
          onChange={evt => setName(evt.target.value)} />

        <Button 
          onClick={onUpdateName}
          className={clsx(
            'absolute shadow-none px-2 border border-black rounded-l-none rounded-r-md right-0 top-0 h-full',
            saved ? 'bg-green-600 focus-visible:bg-green-600 hover:bg-green-600 border-green-600 hover:border-green-600' : undefined
          )}>
          <div className="relative w-14 h-5">
            <div 
              className={clsx('absolute w-full transition-all duration-200 ease-in-out', saved ? 'opacity-0 scale-75' : 'opacity-100 scale-100')} >
              Change
            </div>
            
            <div className={clsx('absolute h-full w-full text-white flex items-center justify-center transition-all duration-300 ease-in-out', saved ? 'opacity-100 scale-100' : 'opacity-0 scale-75')}>
              <Check />
            </div>
          </div>
        </Button>
      </div>

      <p className="px-1 pt-3 text-xs text-muted-foreground text-center flex justify-center gap-1.5 items-baseline tracking-wide"> 
        <a href="/sign-in/" className="hover:text-primary hover:underline">Sign in</a> · <a href="/" target="_blank" className="hover:text-primary hover:underline">About Liiive</a>
      </p>
    </aside>
  )

}