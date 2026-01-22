import clsx from 'clsx';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { twMerge } from 'tailwind-merge';

interface PageFooterProps {

  className?: string;

}

export const PageFooter = (props: PageFooterProps) => {

  const className = twMerge(clsx('py-8 px-4 md:px-6 lg:px-8 bg-sky-950 text-white font-light leading-relaxed', props.className));

  return (
    <footer className={className}>
      <div className="container mx-auto">
        <div className="lg:flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3 p-6">
            <p className="flex gap-2.5 items-center text-sm">
              <a 
                href="https://github.com/rsimon"
                target="_blank">
                <SiGithub className="size-5"/>
              </a>

              <span>
                Brought to you by <a className="text-blue-300 hover:underline" href="https://rainersimon.io" target="_blank" rel="noopener noreferrer">rainersimon.io</a>. 
              </span>
            </p>
          </div>

          <div className="grow-5 p-6"></div>

          <div className="grow p-6"></div>
        </div>
      </div>
    </footer>
  )

}