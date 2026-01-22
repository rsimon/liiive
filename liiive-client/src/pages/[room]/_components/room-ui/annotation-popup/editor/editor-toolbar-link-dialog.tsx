import React, { useEffect, useState } from 'react';
import { Button } from '../../../../../../shadcn/button';
import { Input } from '../../../../../../shadcn/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../../../shadcn/dialog';

interface EditorToolbarLinkDialogProps {

  initialUrl?: string;

  open: boolean;

  onClose(): void;

  onSave(url: string): void;

}

export const EditorToolbarLinkDialog = (props: EditorToolbarLinkDialogProps) => {

  const [url, setUrl] = useState(props.initialUrl || '');

  useEffect(() => {
    setUrl(props.initialUrl ||'');
  }, [props.initialUrl]);

  const onSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    props.onSave(url);
    setUrl('');
  };

  return (
    <Dialog 
      open={props.open} 
      onOpenChange={open => !open && props.onClose()}>
      <DialogContent 
        className="max-w-md p-4">
        <DialogHeader>
          <DialogTitle className="text-base m-0">
            Type or paste a link
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter the URL for the selected text.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="grid gap-4 pb-4">
            <div className="grid gap-2">
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border bg-gray-50"
                autoFocus />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              size="sm"
              className="rounded-full"
              variant="ghost"
              onClick={props.onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              className="rounded-full">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

}