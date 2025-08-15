
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { mockTreatments } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import type { Appointment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setDataLoading(true);
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const appointmentsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date.toDate(), // Convert Firestore Timestamp to JS Date
            createdAt: data.createdAt,
          } as Appointment;
        });
        setAppointments(appointmentsData);
        setDataLoading(false);
      }, (error) => {
        console.error("Error fetching appointments: ", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch appointments from the database.'
        });
        setDataLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, toast]);
  
  if (authLoading || dataLoading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  // In a real app, these would be fetched from Firestore based on the logged-in doctor.
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
