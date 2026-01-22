import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { User } from '@annotorious/core';
import { supabase } from '../../supabase';
import { Button } from '../../shadcn/button';

interface SplashPageAccountActionsProps {

  me?: User;

  onAuthenticated(user: User): void;

  nav?: {
    href: string;
    label: string;
  }[];

}

export const SplashPageAccountActions = (props: SplashPageAccountActionsProps) => {

  const [initialized, setInitialized] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then((result) => {
      setInitialized(true);

      if (result.data?.user) 
        props.onAuthenticated(result.data.user)
    })
  }, []);

  return initialized ? (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`md:hidden absolute top-3 right-3 z-30 hover:bg-transparent ${isMenuOpen ? 'hidden' : ''}`}
        onClick={() => setIsMenuOpen(open => !open)}>
        <Menu className="size-6!" strokeWidth={1.7} />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div
        className={`fixed top-0 left-0 right-0 z-30 bg-sky-950 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0 shadow-sm' : '-translate-y-full'
        } md:translate-y-0 md:static md:bg-transparent`}>
        <div className="flex flex-col md:flex-row items-center justify-end gap-4 p-3 md:absolute md:top-2 md:right-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden self-end hover:bg-transparent"
            onClick={() => setIsMenuOpen(open => !open)}>
            <X className="size-6!" strokeWidth={1.7} />
            <span className="sr-only">Close Menu</span>
          </Button>

          {(props.nav || []).length > 0 && (
            <div className="flex flex-col md:block">
              {props.nav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="w-full md:w-auto md:font-medium tracking-wider rounded text-center px-5 h-auto py-2 transition-colors text-white hover:text-sky-100 focus-visible:text-sky-100 focus-visible:ring-3">
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {props.me ? (
            <a
              className="w-full md:w-auto rounded text-center text-xs px-6 h-auto py-2 text-sky-950 font-semibold transition-colors bg-sky-50 focus-visible:bg-white hover:bg-white focus-visible:ring-3"
              href="/dashboard">
              Dashboard
            </a>
          ) : (
            <>
              <a
                className="w-full md:w-auto rounded border text-center px-6 h-auto py-2 transition-colors text-xs border-white/15 bg-sky-950 hover:border-white/25 focus-visible:border-white/25 focus-visible:ring-3"
                href="/sign-in">
                Sign In
              </a>
              <a
                className="w-full md:w-auto rounded text-center text-xs px-6 h-auto py-2 text-sky-950 font-semibold transition-colors bg-sky-50 focus-visible:bg-white hover:bg-white focus-visible:ring-3"
                href="/sign-up">
                Create Account
              </a>
            </>
          )}
        </div>
      </div>
    </>
  ) : null;

}
