'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAutoLogout } from '../hooks/useAutoLogout';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const SessionGuard = ({ children, allowedRoles }: Props) => {
  const router = useRouter();
  const { logout } = useAutoLogout();

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (!role || !allowedRoles.includes(role.toUpperCase())) {
      logout();
    }
  }, [allowedRoles, logout, router]);

  return <>{children}</>;
};