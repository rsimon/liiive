import type { ReactNode } from 'react';
import { Button } from '../../../shadcn/button';

interface SignUpButtonProps {

  children: ReactNode;

  onClick(): void;

}

export const SignUpButton = (props: SignUpButtonProps) => {

  return (
    <Button 
      className="rounded-lg flex gap-3 [&_svg]:size-5 h-auto py-4 w-full"
      onClick={props.onClick}>
      {props.children}
    </Button>
  )

}