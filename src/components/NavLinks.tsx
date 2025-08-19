
'use client';

import Link from 'next/link';
import type { User } from 'firebase/auth';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  user: User | null;
  isAdmin: boolean;
  inSheet?: boolean;
}

export function NavLinks({ user, isAdmin, inSheet = false }: NavLinksProps) {
  const baseClasses = inSheet 
    ? 'w-full text-foreground' 
    : 'text-sm font-medium text-deep-highlight-foreground hover:text-accent transition-colors';
    
  return (
    <>
      <Link href="/" className={cn(baseClasses)}>Home</Link>
      <Link href="/services" className={cn(baseClasses)}>Services</Link>
      <Link href="/about" className={cn(baseClasses)}>About</Link>
      <Link href="/products" className={cn(baseClasses)}>Products</Link>
      <Link href="/videos" className={cn(baseClasses)}>Videos</Link>
      {user && isAdmin && (
        <Link href="/dashboard" className={cn(baseClasses)}>Dashboard</Link>
      )}
    </>
  );
}
