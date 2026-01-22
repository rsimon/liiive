import { Ban, Loader2 } from 'lucide-react';

interface LoadingOverlayProps {

  loading: boolean;

  connecting: boolean;

  error?: string;

}

export const LoadingOverlay = (props: LoadingOverlayProps) => {

  return (
    <div>
      {props.error ? (
        <div className="flex items-center gap-1.5 text-rose-700">
          <Ban className="h-3.5 w-3.5" strokeWidth={1.7}/> Something went wrong
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-primary">
          <Loader2 
            className="animate-spin h-3.5 w-3.5 mb-[1px]" 
            strokeWidth={1.4}/>
          {props.loading ? 'Loading Manifest' : 'Joining Room'}
        </div>
      )}
    </div>
  )

}