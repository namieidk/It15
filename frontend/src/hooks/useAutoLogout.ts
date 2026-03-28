'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const useAutoLogout = () => {
  const router = useRouter();

  const logout = useCallback(() => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    router.push('/login');
  }, [router]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, TIMEOUT_MS);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [logout]);

  return { logout };
};