import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { mockAppointments, mockTreatments } from '@/lib/data';

export default function DashboardPage() {
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
