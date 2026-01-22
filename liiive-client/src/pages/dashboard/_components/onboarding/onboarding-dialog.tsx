import { Settings } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from '../../../../shadcn/button';
import type { RoomRecord } from '../../../../types';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../../../../shadcn/alert-dialog';

interface OnboardingDialogProps {

  claimedRoom?: RoomRecord;

  open: boolean;

  onOpenChange: (open: boolean) => void;

}

export const OnboardingDialog = (props: OnboardingDialogProps) => {

  return (
    <AlertDialog 
      open={props.open} 
      onOpenChange={props.onOpenChange}>

      <AlertDialogContent className="max-w-2xl pt-8 pb-6 pr-10">
        <div className="container">
          <div className="absolute w-52 h-52">
            <DotLottieReact
              style={{ 
                position: 'absolute',
                top: '-75px',
                left: '-60px'
              }}
              autoplay
              src="/images/party-popper.lottie" />
          </div>

          <div className="pl-28 py-2">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl tracking-wide mb-2.5 mt-1 font-bold">            
                Your Workspace is Ready!
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogDescription className="text-sm text-primary leading-relaxed">
              {props.claimedRoom && (
                <span className="block pb-5">
                  Good news! <strong>{props.claimedRoom.name}</strong> is now linked 
                  to your account and waiting for annotations!
                </span>
              )}
            </AlertDialogDescription>
            
            <p className="text-sm mb-6">
              First time here? Welcome aboard! Here's how to get started:
            </p>

            <ul className="list-disc pl-5 pb-8 mt-2 space-y-2.5 leading-relaxed text-sm">
              <li>
                <strong className="font-bold">Create new rooms</strong> by pasting a IIIF manifest URL in the search bar.
              </li>
              <li>
                <strong>Access your rooms</strong> from the table below.
              </li>
              <li>
                <strong>Manage your rooms</strong> by clicking the <Settings className="inline size-3.5 mb-0.5 mx-0.5" /> icon. 
                Tip: you can upgrade a room to permanent storage here.
              </li>
              <li>
                <strong>Need help?</strong> Visit our <a href="https://liiive.featurebase.app/" target="_blank" className="text-blue-500 hover:underline">community forum</a>.
              </li>
            </ul>

            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button>Got it</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

