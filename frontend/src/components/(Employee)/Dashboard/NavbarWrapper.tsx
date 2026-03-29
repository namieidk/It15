// NavbarWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const Navbar = dynamic(
  () => import('./Navbar').then((mod) => mod.Navbar),
  { ssr: false }
);

export function NavbarWrapper() {  
  return <Navbar />;
}