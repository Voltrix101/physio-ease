
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope, LogOut, Menu, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from './ThemeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { NavLinks } from './NavLinks';


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

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center shadow-md animate-slideDown",
        "bg-deep-highlight/95 dark:bg-card/60 text-deep-highlight-foreground dark:text-foreground backdrop-blur-sm"
        )}>
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
                    <SheetClose asChild><NavLinks inSheet={true} user={user} isAdmin={isAdmin} /></SheetClose>
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
              <NavLinks user={user} isAdmin={isAdmin} />
            </nav>
            <div className="flex items-center gap-4">
                <Button onClick={handleBookAppointmentClick} variant="accent" className="rounded-full bg-gradient-to-r from-[#ffb84d] to-[#ff9933] text-white hover:scale-105 transition-all">
                    Book Appointment
                </Button>
                <ThemeToggle />
                {!loading && user && (
                  <div className='flex items-center gap-2'>
                    <Button variant="ghost" size="icon" title="Notifications" className="hover:bg-accent/20 dark:hover:bg-white/5 relative">
                      <Bell className="h-5 w-5" />
                      {/* Optional: Notification badge */}
                      {/* <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span> */}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='relative h-9 w-9 rounded-full hover:bg-accent/20 dark:hover:bg-white/5'>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User"} />
                                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName ?? 'Doctor'}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
            </div>
          </>
        )}
    </header>
  );
}
