import { useEffect, useState } from 'react';
import type { User } from '@annotorious/core';
import { supabase } from '../supabase';

export const useAuth = () => {

  const [me, setMe] = useState<User | undefined>();

  useEffect(() => {
    supabase.auth.getUser().then(result => {  
      if (result.data?.user) {
        const { id, user_metadata } = result.data.user;

        setMe({
          id,
          avatar: user_metadata.avatar_url,
          name: user_metadata.name
        });
      }
    });
  }, []);

  return me;

}