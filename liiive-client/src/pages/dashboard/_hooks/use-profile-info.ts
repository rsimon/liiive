import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase';
import type { 
  MyProfileInformation, 
  ProfileQuotas
} from '../../../types';

export const useProfileInfo = (onUnauthorized: () => void) => {

  const [profileInfo, setProfileInfo] = useState<MyProfileInformation | undefined>();

  useEffect(() => {
    supabase.auth.getUser().then(result => {  
      if (result.data?.user) {
        const { id, user_metadata } = result.data.user;

        supabase
          .from('profile')
          .select(`
            *,
            profile_quotas (*)
          `)
          .eq('id', id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              const quotas: ProfileQuotas = data.profile_quotas;
              setProfileInfo({ 
                me: {
                  id,
                  avatar: user_metadata.avatar_url,
                  name: user_metadata.name
                },
                quotas
              })
            } else {
              console.error('Error fetching profile informatin', { data, error });
            }
          });      
      } else {
        onUnauthorized();
      }
    });
  }, []);

  return profileInfo;

}