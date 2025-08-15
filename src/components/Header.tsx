import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-headline">PhysioEase</span>
        </Link>
        <nav className="flex items-center gap-2">
           <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/book">Book Now</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/dashboard">Doctor Area</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
