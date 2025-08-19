
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';


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

  const NavLinks = ({ inSheet }: { inSheet?: boolean }) => (
    <>
      <Link href="/" className={`${inSheet ? 'w-full' : ''} hover:text-accent transition`}>Home</Link>
      <Link href="/services" className={`${inSheet ? 'w-full' : ''} hover:text-accent transition`}>Services</Link>
      <Link href="/about" className={`${inSheet ? 'w-full' : ''} hover:text-accent transition`}>About</Link>
      <Link href="/products" className={`${inSheet ? 'w-full' : ''} hover:text-accent transition`}>Products</Link>
      <Link href="/videos" className={`${inSheet ? 'w-full' : ''} hover:text-accent transition`}>Videos</Link>
      {user && isAdmin && (
        <Link href="/dashboard" className={`${inSheet ? 'w-full' : ''} hover:text-accent transition`}>Dashboard</Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2e4a3f] text-white dark:bg-[#121212]/80 dark:backdrop-blur-sm px-6 py-4 flex justify-between items-center shadow-md dark:shadow-black/20 animate-slideDown">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Stethoscope className="h-6 w-6 text-accent" />
          <span className="font-headline text-2xl tracking-wide text-white">Pain Manage Clinic</span>
        </Link>
        
        {isMobile ? (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#2e4a3f] dark:bg-[#121212] text-white border-l-0">
                  <SheetHeader>
                    <SheetTitle className="text-white font-headline text-2xl tracking-wide text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-6 text-lg mt-8">
                    <SheetClose asChild><NavLinks inSheet={true} /></SheetClose>
                    <Button onClick={handleBookAppointmentClick} variant="accent" className="mt-4">
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
          </div>
        ) : (
          <>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <NavLinks />
            </nav>
            <div className="flex items-center gap-4">
                <Button onClick={handleBookAppointmentClick} variant="accent">
                    Book Appointment
                </Button>
                 <ThemeToggle />
                {!loading && user && (
                     <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:bg-white/10 dark:hover:bg-white/5">
                        <LogOut className="h-5 w-5" />
                    </Button>
                )}
            </div>
          </>
        )}
    </header>
  );
}
