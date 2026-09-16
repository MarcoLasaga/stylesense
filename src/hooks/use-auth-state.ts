import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isLoggedIn, setAuthState } from '@/lib/store';

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());

  useEffect(() => {
    let active = true;
    const refresh = () => setIsAuthenticated(isLoggedIn());

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) setAuthState(true);
      setIsAuthenticated(Boolean(data.session) || isLoggedIn());
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) setAuthState(true);
      if (event === 'SIGNED_OUT') setAuthState(false);
      setIsAuthenticated(Boolean(session) || isLoggedIn());
    });

    window.addEventListener('stylesense-auth-change', refresh);
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
      window.removeEventListener('stylesense-auth-change', refresh);
    };
  }, []);

  return isAuthenticated;
}