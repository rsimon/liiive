import type { Provider } from '@supabase/supabase-js';
import { SiGoogle, SiGithub } from '@icons-pack/react-simple-icons';
import { supabase } from '../../../supabase';
import { useClaimableRooms } from '../../../hooks/use-claimableRooms';
import { SignInButton } from './sign-in-button';

const redirect = new URLSearchParams(window.location.search).get('redirect');

export const SignIn = () => {

  const { setCurrentClaim, clearCurrentClaim } = useClaimableRooms();

  const onSignIn = (provider: string) => () => {
    const claim = new URLSearchParams(window.location.search).get('claim');

    if (claim)
      setCurrentClaim(claim);
    else 
      clearCurrentClaim();

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
    <ul className="space-y-4 z-10 w-96 max-w-full px-2 relative">
      <li>
        <SignInButton
          onClick={onSignIn('google')}>
          <SiGoogle /> Google
        </SignInButton>
      </li>

      <li>
        <SignInButton
          onClick={onSignIn('github')}>
          <SiGithub /> Github
        </SignInButton>
      </li>
    </ul>
  )

}