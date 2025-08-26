"use client";

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

const LogoutManager = () => {
  const { status } = useSession();

  useEffect(() => {
    // This effect runs on every page load. We only care about authenticated users.
    if (status === 'authenticated') {
      
      // The Performance Navigation Timing API is a reliable way to detect a refresh.
      const navigationEntries = performance.getEntriesByType("navigation");

      // Check if the first (and only) navigation entry on this page was a 'reload'.
      if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
        
        // If the page was explicitly reloaded by the user, sign them out.
        signOut({ redirect: true, callbackUrl: '/' });
      }
    }
  }, [status]); // We run this check once the session status is confirmed.

  // This component does not render anything to the screen.
  return null;
};

export default LogoutManager;