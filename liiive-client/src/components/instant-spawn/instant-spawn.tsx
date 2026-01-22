import { useEffect, useState } from 'react';
import { useClaimableRooms } from '../../hooks/use-claimableRooms';
import { useManifestValidation } from '../../hooks/use-manifest-validation';
import { createRoom } from '../../utils/create-room';
import type { ManifestValidationFailure } from '../../types';
import { useLoginStatus } from './use-login-status';

// SSR-safe
const params = typeof window !== 'undefined' 
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams();

const iiifContent = params.get('iiif-content');

const seed = params.get('seed') || undefined;

const canvas = params.get('canvas') || undefined;

interface InstantSpawnProps {

  referer: string | null;

}

export const InstantSpawn = (props: InstantSpawnProps) => {

  const status = useLoginStatus();

  const { result } = useManifestValidation(iiifContent!);

  const [error, setError] = useState<string | undefined>(undefined);

  const { createClaimableRoom } = useClaimableRooms();

  useEffect(() => {
    if (!result || status === 'pending') return;

    if (result.isValid) {
      createRoom(
        iiifContent!,
        result.content.type,
        result.content.majorVersion,
        result.thumbnail,
        result.pages,
        result.label,
        seed ? `${props.referer}:${seed}:${iiifContent}` : undefined
      ).then(room => {
        if (status === 'not_logged_in')
          createClaimableRoom(room);

        if (canvas)
          location.replace(`/${room.id}?canvas=${canvas}`);
        else
          location.replace(`/${room.id}`);
      }).catch(() => {
        console.error(error);
        setError('Could not create room');
      });
    } else {
      setError((result as ManifestValidationFailure).error || 'Invalid manifest or unsupported manifest type')
    }
  }, [result, status]);

  return error ? (
    <span>{error}</span>
  ) : null;

}