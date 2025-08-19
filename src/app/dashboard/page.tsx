
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { Loader2 } from 'lucide-react';

function DashboardPageContent() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.replace('/login');
    }
  }, [user, authLoading, isAdmin, router]);

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <DashboardClient />
    </div>
  );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <DashboardPageContent />
        </Suspense>
    );
}
