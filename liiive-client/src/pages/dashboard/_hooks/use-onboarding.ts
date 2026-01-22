import { useCallback, useState } from 'react';

const ONBOARDING_FLAG_KEY = 'liiive:onboarding-dismissed';

export const useOnboarding = () => {

  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem(ONBOARDING_FLAG_KEY));

  const dismissOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_FLAG_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  return {
    dismissOnboarding,
    showOnboarding
  }

}