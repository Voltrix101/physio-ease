
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
      <Link href="/" className={`${inSheet ? 'w-full text-foreground dark:text-deep-highlight-foreground' : 'text-deep-highlight-foreground hover:text-accent transition-colors'}`}>Home</Link>
      <Link href="/services" className={`${inSheet ? 'w-full text-foreground dark:text-deep-highlight-foreground' : 'text-deep-highlight-foreground hover:text-accent transition-colors'}`}>Services</Link>
      <Link href="/about" className={`${inSheet ? 'w-full text-foreground dark:text-deep-highlight-foreground' : 'text-deep-highlight-foreground hover:text-accent transition-colors'}`}>About</Link>
      <Link href="/products" className={`${inSheet ? 'w-full text-foreground dark:text-deep-highlight-foreground' : 'text-deep-highlight-foreground hover:text-accent transition-colors'}`}>Products</Link>
      <Link href="/videos" className={`${inSheet ? 'w-full text-foreground dark:text-deep-highlight-foreground' : 'text-deep-highlight-foreground hover:text-accent transition-colors'}`}>Videos</Link>
      {user && isAdmin && (
        <Link href="/dashboard" className={`${inSheet ? 'w-full text-foreground dark:text-deep-highlight-foreground' : 'text-deep-highlight-foreground hover:text-accent transition-colors'}`}>Dashboard</Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-deep-highlight text-deep-highlight-foreground px-6 py-4 flex justify-between items-center shadow-md animate-slideDown">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Stethoscope className="h-6 w-6 text-accent" />
          <span className="font-headline text-2xl tracking-wide">Pain Manage Clinic</span>
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
              <SheetContent side="right" className="bg-card dark:bg-[#121212] text-foreground border-l">
                  <SheetHeader>
                    <SheetTitle className="text-foreground dark:text-deep-highlight-foreground font-headline text-2xl tracking-wide text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-6 text-lg mt-8">
                    <SheetClose asChild><NavLinks inSheet={true} /></SheetClose>
                    <Button onClick={handleBookAppointmentClick} variant="accent" className="mt-4 rounded-full bg-gradient-to-r from-[#ffb84d] to-[#ff9933] text-white hover:scale-105 transition-all">
                      Book Appointment
                    </Button>
                     {user && (
                      <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2 text-lg text-foreground dark:text-deep-highlight-foreground">
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
                <Button onClick={handleBookAppointmentClick} variant="accent" className="rounded-full bg-gradient-to-r from-[#ffb84d] to-[#ff9933] text-white hover:scale-105 transition-all">
                    Book Appointment
                </Button>
                 <ThemeToggle />
                {!loading && user && (
                     <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:bg-accent/20 dark:hover:bg-white/5">
                        <LogOut className="h-5 w-5" />
                    </Button>
                )}
            </div>
          </>
        )}
    </header>
  );
}
