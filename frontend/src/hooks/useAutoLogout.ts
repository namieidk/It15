'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const useAutoLogout = () => {
  const router = useRouter();

  const logout = useCallback(async () => {
    // 1. Ask the backend to clear the HttpOnly JWT cookie.
    //    We can't delete an HttpOnly cookie from JS — only the server can.
    try {
      await fetch('http://localhost:5076/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // must be included so the cookie is sent
      });
    } catch {
      // Even if the request fails (offline), proceed with local cleanup
    }

    // 2. Clear display-only localStorage values
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');

    // 3. Redirect to login
    router.push('/login');
  }, [router]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, TIMEOUT_MS);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [logout]);

  return { logout };
};