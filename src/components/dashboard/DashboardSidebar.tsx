
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Stethoscope, LayoutDashboard, Calendar, ListOrdered, ShoppingCart, Youtube, Star, User, Settings, LineChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';

const navItems = [
  { href: 'analytics', icon: LineChart, label: 'Analytics' },
  { href: 'appointments', icon: Calendar, label: 'Appointments' },
  { href: 'patients', icon: User, label: 'Patients' },
  { href: 'treatments', icon: ListOrdered, label: 'Treatments' },
  { href: 'products', icon: ShoppingCart, label: 'Products' },
  { href: 'videos', icon: Youtube, label: 'Videos' },
  { href: 'testimonials', icon: Star, label: 'Testimonials' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'analytics';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside className={cn(
      "hidden md:flex flex-col justify-between border-r bg-card text-card-foreground transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div>
        <div className={cn("flex h-16 items-center border-b px-6", isCollapsed ? 'justify-center' : 'justify-start')}>
            <Link href="/" className="flex items-center gap-2 font-bold">
                <Stethoscope className="h-7 w-7 text-primary" />
                {!isCollapsed && <span className="font-headline text-xl tracking-wide">PhysioEase</span>}
            </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                     <Link
                        href={`${pathname}?view=${item.href}`}
                        className={cn(
                          buttonVariants({ variant: 'ghost' }),
                          "group flex items-center gap-3 transition-colors",
                           isCollapsed ? 'justify-center' : 'justify-start',
                          currentView === item.href
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'hover:bg-muted/50'
                        )}
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                         {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                </TooltipTrigger>
                 {isCollapsed && <TooltipContent side="right"><p>{item.label}</p></TooltipContent>}
            </Tooltip>
          ))}
          </TooltipProvider>
        </nav>
      </div>

       <div className="border-t p-4">
           <Button variant="ghost" onClick={toggleCollapse} className="w-full flex items-center gap-3">
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {!isCollapsed && <span>Collapse</span>}
          </Button>
      </div>
    </aside>
  );
}
