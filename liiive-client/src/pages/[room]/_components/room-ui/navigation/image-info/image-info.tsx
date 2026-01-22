import { Info, X } from 'lucide-react';
import { Button } from '../../../../../../shadcn/button';
import type { IIIFContent, IIIFManifest } from '../../../../../../types';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../../shadcn/tooltip';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '../../../../../../shadcn/dialog';

interface ImageInfoProps {

  iiifContent?: IIIFContent;

}

export const ImageInfo = (props: ImageInfoProps) => {

  const isManifest = props.iiifContent?.type === 'MANIFEST';

  const manifest = isManifest ? (props.iiifContent as IIIFManifest).parsed : undefined;

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              disabled={!isManifest}
              variant="ghost"
              size="icon">
              <Info strokeWidth={1.7} />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>

        {manifest && (
          <DialogContent className="max-w-3xl p-8">
            <DialogClose 
              asChild
              className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon">
                <X />
              </Button>
            </DialogClose>

            <DialogTitle className="tracking-wide">
              {manifest.getDefaultLabel()}
            </DialogTitle>

            <DialogDescription className="sr-only">
              Manifest metadata for {manifest.getDefaultLabel()}
            </DialogDescription>

            <ul className="py-4 space-y-4">
              {(manifest.getMetadata() || []).map(({ label, value }, idx) => (
                <li key={`${label}-${idx}`}>
                  <div 
                    className="font-semibold">
                    {label?.getValue()}
                  </div>
                  <div 
                    className="pl-4 [&_a]:text-sky-700 hover:[&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: value?.getValue() || '' }} />
                </li>
              ))}
            </ul>
          </DialogContent>
        )}

        <TooltipContent>
          View manifest metadata
        </TooltipContent>
      </Tooltip>
    </Dialog>
  )

}