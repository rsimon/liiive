import type { ReactNode } from 'react';
import { Button } from '../../../shadcn/button';

interface SignInButtonProps {

  children: ReactNode;

  onClick(): void;

}

export const SignInButton = (props: SignInButtonProps) => {

  return (
    <Button 
      className="rounded-lg shadow-sm flex gap-3 [&_svg]:size-5 h-auto py-4 w-full border backdrop-blur-xs border-white/10 bg-sky-900/50 hover:border-white/20 hover:bg-sky-900/60"
      onClick={props.onClick}>
      {props.children}
    </Button>
  )

}