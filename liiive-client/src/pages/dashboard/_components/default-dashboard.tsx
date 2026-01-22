import { useProfileInfo } from '../_hooks';
import { Dashboard } from "./dashboard";

const onUnauthorized = () => window.location.href = '/sign-in';

/**
 * The default dashboard for the open source version. Wrapper project
 * may want to extend the user profile (e.g. adding subscription data).
 */
export const DefaultDashboard = () => {

  const profile = useProfileInfo(onUnauthorized);

  return (
    <Dashboard profile={profile} />
  )

}