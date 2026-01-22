import { useCallback, useState } from 'react';
import { Ban, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import type { User } from '@annotorious/core';
import { Button } from '../../shadcn/button';
import { Input } from '../../shadcn/input';
import { useClaimableRooms } from '../../hooks/use-claimableRooms';
import { createRoom } from '../../utils/create-room';
import type { ManifestValidationResult } from '../../types';
import { ManifestValidation } from './manifest-validation';

interface IIIFImporterProps {

  className?: string;

  me?: User;

}

type CreateRoomState = 'creating' | 'success' | 'failed';

export const IIIFImporter = (props: IIIFImporterProps) => {

  const [url, setURL] = useState('');

  const [validationResult, setValidationResult] = useState<ManifestValidationResult | undefined>(undefined);

  const [createRoomState, setCreateRoomState] = useState<CreateRoomState | undefined>();

  const busy = createRoomState === 'creating' || createRoomState === 'success';

  const error = createRoomState === 'failed';

  const { createClaimableRoom } = useClaimableRooms();

  const onGoLiiive = useCallback((url: string, result: ManifestValidationResult) => {
    if (!result.isValid) return;

    setCreateRoomState('creating');

    createRoom(
      url,
      result.content.type,
      result.content.majorVersion,
      result.thumbnail,
      result.pages,
      result.label
    ).then(room => {
      const isGuest = !props.me || props.me.isGuest;
      if (isGuest)
        createClaimableRoom(room);

      setCreateRoomState('success');
      window.location.replace(`/${room.id}`);
    }).catch(error => {
      setCreateRoomState('failed');
    });
  }, [props.me, createClaimableRoom]);

  return (
    <div className={props.className}>
      <form 
        onSubmit={evt => evt.preventDefault()}
        className={clsx('flex w-full', !validationResult?.isValid && 'cursor-not-allowed')}>
        <Input 
          autoFocus
          className="bg-white text-primary border grow border-white rounded-r-none text-md h-10 outline-hidden focus:ring-0 focus-visible:ring-0" 
          placeholder="Paste IIIF URL" 
          value={url}
          onChange={evt => setURL(evt.target.value)} />

        <Button 
          disabled={!validationResult?.isValid}
          className="rounded-l-none rounded-r font-semibold text-md h-10 bg-black disabled:opacity-100"
          onClick={() => onGoLiiive(url, validationResult!)}>
          {busy && (
            <Loader2 className="absolute animate-spin" />
          )}

          <span className={busy ? 'opacity-0' : undefined}>Go liiive!</span>
        </Button>
      </form>

      {error ? (
        <div className="absolute -bottom-8 mt-4 text-red-400 flex gap-2 items-center">
          <Ban className="h-3.5 w-3.5" /> Something went wrong
        </div>
      ) : (
        <ManifestValidation
          url={url} 
          onValidate={setValidationResult} />
      )}
    </div>
  )


}