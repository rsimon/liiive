import type { ReactNode } from 'react';
import { Button } from '../../shadcn/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../../shadcn/alert-dialog';

export interface ConfirmationDialogProps {

  cancelLabel?: string;

  className?: string;

  confirmIcon?: ReactNode;

  confirmLabel?: string;

  destructive?: boolean;

  message?: string;

  open: boolean;

  title?: string;

  onCancel?(evt: React.MouseEvent): void;

  onConfirm?(evt: React.MouseEvent): void;

  onOpenChange(open: boolean): void;

}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => {

  return (
    <AlertDialog 
      open={props.open} 
      onOpenChange={props.onOpenChange}>

      <AlertDialogContent 
        className={props.className}
        onOpenAutoFocus={e => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>            
            {props.title || 'Are you sure?'}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription>
          {props.message || 'This action cannot be undone.'}
        </AlertDialogDescription>

        <AlertDialogFooter>
          {props.onCancel && (
            <AlertDialogCancel asChild>
              <Button 
                variant="outline"
                onClick={props.onCancel}>
                {props.cancelLabel || 'Cancel'}
              </Button>
            </AlertDialogCancel>
          )}
          <AlertDialogAction 
            asChild
            variant={props.destructive ? 'destructive' : undefined}>
            <Button
              onClick={props.onConfirm}>
              {props.confirmIcon}
              {props.confirmLabel || 'Ok'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

}

