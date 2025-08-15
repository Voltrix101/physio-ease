import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-semibold">Pain Manage Clinic</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
           <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
           <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
           <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
           <Link href="/videos" className="text-sm font-medium hover:text-primary transition-colors">Videos</Link>
        </nav>
        <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
            <Link href="/book">Book Now</Link>
        </Button>
      </div>
    </header>
  );
}
