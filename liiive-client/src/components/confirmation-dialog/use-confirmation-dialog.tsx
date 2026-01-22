import { useState } from 'react';
import { ConfirmationDialog as DialogComponent } from './confirmation-dialog';
import type { ConfirmationDialogProps } from './confirmation-dialog';

export const useConfirmationDialog = (props: Omit<ConfirmationDialogProps, 'open' | 'onOpenChange'>) => {

  const [isOpen, setIsOpen] = useState(false);

  const showDialog = () => setIsOpen(true);

  const closeDialog = () => setIsOpen(false);

  const ConfirmationDialog = () => (
    <DialogComponent
      {...props} 
      open={isOpen} 
      onOpenChange={closeDialog} />
  )

  return [showDialog, ConfirmationDialog] as const;

}