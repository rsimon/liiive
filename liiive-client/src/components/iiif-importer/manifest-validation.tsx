import { useEffect } from 'react';
import clsx from 'clsx';
import { Ban, Check, CloudOff } from 'lucide-react';
import { MoonLoader}  from 'react-spinners';
import { useManifestValidation } from '../../hooks/use-manifest-validation';
import type { ManifestValidationFailure, ManifestValidationResult } from '../../types';

interface ManifestValidationProps {

  url: string;

  onValidate(result: ManifestValidationResult): void;

}

export const ManifestValidation = (props: ManifestValidationProps) => {

  const { isFetching, result } = useManifestValidation(props.url);

  const color = (result?.isValid) ? 'text-green-400' : 'text-red-400';

  useEffect(() => {
    if (!result) return;
    props.onValidate(result);
  }, [props.onValidate, result]);

  return (
    <div className={clsx(color, 'absolute -bottom-8 mt-4 flex gap-2 items-center text-sm')}>
      {isFetching ? (
        <MoonLoader 
          size={12}
          color='#ffffff' />
      ) : result ? (
        result.isValid ? (
          <>
            <Check className="h-4 w-5" />
            <span className="whitespace-nowrap truncate">{result.label || (
              `IIIF ${result.content.type === 'IMAGE' ? 'Image' : 'Presentation'} API v${result.content.majorVersion}`
            )}</span>
          </>
        ) : (result as ManifestValidationFailure).error === 'not_https' ? (
          <>
            <Ban className="h-3.5 w-3.5" />
            <span>Invalid URL - must start with 'https'</span>
          </>
        ) : (result as ManifestValidationFailure).error === 'invalid_url' ? (
          <>
            <Ban className="h-3.5 w-3.5" />
            <span>Please enter a valid URL</span>
          </>
        ) : (result as ManifestValidationFailure).error === 'fetch_error' ? (
          <>
            <CloudOff className="h-3.5 w-3.5" />
            <span>
              Could not fetch the manifest. Server may restrict access. <a className="underline" href="https://iiif.io/guides/guide_for_implementers/#other-considerations" target="_blank">Learn more</a>.
            </span>
          </>
        ) : ((result as ManifestValidationFailure).error === 'invalid_manifest' || 
             (result as ManifestValidationFailure).error === 'unsupported_manifest_type') ? (
          <>
            <Ban className="h-3.5 w-3.5" />
            <span>Invalid manifest or unsupported manifest type</span>
          </>
        ) : null
      ) : null}
    </div>
  )

}