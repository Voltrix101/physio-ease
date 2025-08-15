
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2e4a3f] text-white px-6 py-4 flex justify-between items-center shadow-md animate-slideDown">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Stethoscope className="h-6 w-6 text-[#e0a96d]" />
          <span className="font-headline text-2xl tracking-wide text-white">Pain Manage Clinic</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
           <Link href="/" className="hover:text-[#e0a96d] transition">Home</Link>
           <Link href="/about" className="hover:text-[#e0a96d] transition">About</Link>
           <Link href="/products" className="hover:text-[#e0a96d] transition">Products</Link>
           <Link href="/videos" className="hover:text-[#e0a96d] transition">Videos</Link>
           {/* You might want a contact page link */}
           {/* <Link href="/contact" className="hover:text-[#e0a96d] transition">Contact</Link> */}
           {user && isAdmin && (
            <Link href="/dashboard" className="hover:text-[#e0a96d] transition">Dashboard</Link>
           )}
        </nav>
        <div className="flex items-center gap-2">
            <Button asChild className="bg-[#e0a96d] text-black px-4 py-2 rounded-lg hover:bg-[#d18f50] hover:scale-105 transform transition">
                <Link href="/book">Book Appointment</Link>
            </Button>
            {!loading && user && (
                 <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:bg-white/10">
                    <LogOut className="h-5 w-5" />
                </Button>
            )}
        </div>
    </header>
  );
}
