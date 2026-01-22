import { LogOut, Settings } from 'lucide-react';
import { supabase } from '../../../supabase';
import { Avatar } from '../../../components';
import { Button } from '../../../shadcn/button';
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '../../../shadcn/popover';
import type { DashboardAccountSettingsProps } from './dashboard';

export const DashboardAccountSettings = (props: DashboardAccountSettingsProps) => {

  const { me, quotas } = props.profile;

  const depleted = props.permanent / quotas.permanent_rooms_limit;

  const onSignOut = () => {
    supabase.auth.signOut().then(() => {
      window.location.href = '/';
    });
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className={props.className}>
            <Avatar user={me} className="z-10" />
          </button>
        </PopoverTrigger>

        <PopoverContent 
          align="end" 
          alignOffset={-8}
          className="w-60 p-0 backdrop-blur-xs bg-sky-900 border-white/10 shadow-lg">

          <PopoverArrow className="fill-[#0c4a6e] drop-shadow-xs -translate-y-px" width={16} height={8} />

          <div className="text-white text-sm">
            <div className="border-b pt-2 pb-4 pl-2.5 pr-3 border-b-white/15">
              <div className="text-xs font-medium tracking-wide flex justify-between pr-0.5">
                <span>Permanent Rooms Used</span>
                <span 
                  className={depleted < 0.75 ? undefined : depleted < 1 ? 'text-amber-500' : 'text-red-500'}>
                  <span className={props.permanent === quotas.permanent_rooms_limit ? 'font-semibold' : 'opacity-70'}>{props.permanent}</span> / <span className="font-semibold">{quotas.permanent_rooms_limit}</span>
                </span>
              </div>
          
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                {props.permanent < quotas.permanent_rooms_limit ? (
                  <span>
                    {props.permanent < quotas.permanent_rooms_limit / 2 && (
                      <>So much space!{' '}</>
                    )} 
                    <>Make a room permanent via the <Settings className="inline size-3.5 mb-0.5"/> room settings.</>
                  </span>
                ) : (
                  <span>{Math.round(100 * props.permanent / quotas.permanent_rooms_limit)}% used. Make rooms temporary, or get contact your admin for more space.</span>
                )}
              </p>
            </div>

            <div className="px-1 py-1">
              <Button 
                className="cursor-pointer font-light w-full rounded text-white px-2.5 hover:bg-white/10 justify-start"
                variant="ghost"
                onClick={onSignOut}>
                <LogOut strokeWidth={1.7} /> Sign out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )

}