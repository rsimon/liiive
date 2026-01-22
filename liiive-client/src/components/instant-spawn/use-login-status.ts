import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

type LoginStatus = 'pending' | 'logged_in' | 'not_logged_in';

export const useLoginStatus = () => {

  const [status, setStatus] = useState<LoginStatus>('pending');

  useEffect(() => {
    supabase.auth.getUser().then(result => { 
      if (result.data?.user) {
        setStatus('logged_in');
      } else {
        setStatus('not_logged_in')
      }
    });
  }, []);

  return status;

}

