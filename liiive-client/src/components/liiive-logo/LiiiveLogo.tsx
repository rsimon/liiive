import clsx from 'clsx';

interface LiiiveLogoProps {

  className?: string;

  monochrome?: boolean;

}

export const LiiiveLogo = (props: LiiiveLogoProps) => {

  return (
    <span className={clsx('font-dosis font-bold tracking-wider', props.className)}>
      {props.monochrome ? (
        <>liiive</>
      ) : (
        <>l<span style={{ color: 'var(--iiif-blue)' }}>i</span><span style={{ color: 'var(--iiif-red)'  }}>i</span><span style={{ color: 'var(--iiif-blue)' }}>i</span>ve</>
      )}
    </span>
  )

}