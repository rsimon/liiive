import { Loader2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogTitle 
} from '../../../../shadcn/alert-dialog';

interface OnboardingMaskProps {

  open: boolean;

}

export const OnboardingMask = (props: OnboardingMaskProps) => {

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent
        className="w-24 flex items-center justify-center bg-transparent border-none shadow-none text-white">
        <AlertDialogTitle className="sr-only">Loading...</AlertDialogTitle>
        <AlertDialogDescription className="sr-only">Please wait.</AlertDialogDescription>
        <Loader2 className="animate-spin size-6" />
      </AlertDialogContent>
    </AlertDialog>
  )

}

