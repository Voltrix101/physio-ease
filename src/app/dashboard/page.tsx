
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { mockAppointments, mockTreatments } from '@/lib/data';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  // In a real app, these would be fetched from Firestore based on the logged-in doctor.
  const appointments = mockAppointments;
  const treatments = mockTreatments;

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Manage your appointments, treatments, and patients.</p>
        </div>
        <DashboardClient appointments={appointments} treatments={treatments} />
      </main>
    </>
  );
}
