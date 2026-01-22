import { DoorOpen, LogOut } from 'lucide-react';
import { supabase } from '../../../../../../supabase';
import { Button } from '../../../../../../shadcn/button';

export const SettingsSignedIn = () => {

  const onSignOut = () => {
    supabase.auth.signOut().then(() => {
      window.location.href = '/';
    });
  }

  return (
    <aside>
      <div>
        <a 
          href="/dashboard/" 
          target="_blank" 
          className="flex gap-2 items-center h-9 px-3 rounded hover:bg-accent">
          <DoorOpen className="size-4" strokeWidth={1.7} /> Return to Dashboard
        </a>
      </div>

      <div className="border-t pt-1 mt-1">
        <Button
          variant="ghost"
          className="gap-2 w-full justify-start px-3 rounded font-normal"
          onClick={onSignOut}>
          <LogOut strokeWidth={1.7} /> Sign out
        </Button>
      </div>
    </aside>
  )

}