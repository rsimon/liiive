
import { Check, ChevronLeft } from 'lucide-react';
import { SiGoogle, SiGithub } from '@icons-pack/react-simple-icons';
import type { Provider } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';
import { LiiiveLogo } from '../../../components';
import { SignUpButton } from './sign-up-button';

const redirect = new URLSearchParams(window.location.search).get('redirect');

export const SignUp = () => {

  const onSignIn = (provider: string) => () => {
    const redirectTo = redirect 
      ? `${window.location.origin}${redirect}`
      : `${window.location.origin}/dashboard`;
      
    supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo
      }
    })
  }

  return (
    <div className="container flex flex-col gap-4 px-6 md:max-w-5xl z-10">
      <div className="mb-2">
        <h3 className="text-xl font-semibold md:text-3xl tracking-wide">
          Sign Up & Get More Out of <LiiiveLogo className="text-4xl ml-1 mr-1" />!
        </h3>
        <p className="my-2 text-white/70 tracking-wider font-light">
          You can use liiive without signing up. But an account gives you extra features:
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between bg-sky-50 shadow-lg gap-8 rounded-lg p-8 text-primary">
        <ul className="py-2 text-sm lg:border-r lg:pr-6 space-y-2 shrink-0">
          {[{ 
              heading: 'Extended Room Lifetime.',
              content: 'Keep your collaborative spaces for 24 hours instead of 4.'
            }, {
              heading: 'Personal Dashboard.',
              content: 'Track your created and visited rooms and never lose a room link again.'
            }, {
              heading: 'Permanent Storage.',
              content: 'Save and keep rooms and annotations indefinitely.'
            }
          ].map(({ heading, content }, index) => (
            <li key={index} className="flex items-start gap-3 leading-normal">
              <Check className="size-5 mt-px text-green-600 shrink-0" strokeWidth={1.7} />
              <div>
                <strong>{heading}</strong>
                <p>{content}</p>
              </div>
            </li>           
          ))}
        </ul>

        <div className="flex flex-col items-center gap-4 text-center lg:flex-1">
          <h3 className="font-semibold mb-1">
            Sign up with
          </h3>
          <ul className="space-y-4 w-full max-w-sm">
            <li>
              <SignUpButton
                onClick={onSignIn('google')}>
                <SiGoogle /> Google
              </SignUpButton>
            </li>

            <li>
              <SignUpButton
                onClick={onSignIn('github')}>
                <SiGithub /> Github
              </SignUpButton>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-white/70 text-sm self-start">
        <a href="/" className="text-blue-300 flex  gap-0.5 items-center hover:underline">
          <ChevronLeft className="size-5" /> Back to Home
        </a>
      </div>
    </div>
  )

}