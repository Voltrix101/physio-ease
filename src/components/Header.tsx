
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';


export function Header() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await auth.signOut();
    // The useAuth hook will handle redirection automatically when the user state changes.
    // This prevents a race condition and ensures a smooth, no-refresh experience.
    router.push('/');
  };
  
  const handleBookAppointmentClick = () => {
    if (user) {
      router.push('/book');
    } else {
      router.push('/login');
    }
  };

  const NavLinks = () => (
    <>
      <Link href="/" className="hover:text-[#e0a96d] transition">Home</Link>
      <Link href="/services" className="hover:text-[#e0a96d] transition">Services</Link>
      <Link href="/about" className="hover:text-[#e0a96d] transition">About</Link>
      <Link href="/products" className="hover:text-[#e0a96d] transition">Products</Link>
      <Link href="/videos" className="hover:text-[#e0a96d] transition">Videos</Link>
      {user && isAdmin && (
        <Link href="/dashboard" className="hover:text-[#e0a96d] transition">Dashboard</Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2e4a3f] text-white px-6 py-4 flex justify-between items-center shadow-md animate-slideDown">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Stethoscope className="h-6 w-6 text-[#e0a96d]" />
          <span className="font-headline text-2xl tracking-wide text-white">Pain Manage Clinic</span>
        </Link>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#2e4a3f] text-white border-l-0">
                <SheetHeader>
                  <SheetTitle className="text-white font-headline text-2xl tracking-wide text-left">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 text-lg mt-8">
                  <SheetClose asChild><NavLinks /></SheetClose>
                  <Button onClick={handleBookAppointmentClick} className="bg-[#e0a96d] text-black px-4 py-2 rounded-lg hover:bg-[#d18f50] hover:scale-105 transform transition mt-4">
                    Book Appointment
                  </Button>
                   {user && (
                    <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2 text-lg">
                        <LogOut className="h-5 w-5" /> Logout
                    </Button>
                  )}
                </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <NavLinks />
            </nav>
            <div className="flex items-center gap-2">
                <Button onClick={handleBookAppointmentClick} className="bg-[#e0a96d] text-black px-4 py-2 rounded-lg hover:bg-[#d18f50] hover:scale-105 transform transition">
                    Book Appointment
                </Button>
                {!loading && user && (
                     <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:bg-white/10">
                        <LogOut className="h-5 w-5" />
                    </Button>
                )}
            </div>
          </>
        )}
    </header>
  );
}
