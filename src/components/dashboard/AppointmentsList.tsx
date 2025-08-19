
'use client';

import { useState, useEffect } from 'react';
import type { Appointment } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppointmentsTable } from './AppointmentsTable';
import { doc, updateDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AppointmentsList() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    useEffect(() => {
      setLoading(true);
      try {
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
          setLoading(false);
        }, (error) => {
          console.error("Error fetching appointments: ", error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch appointments from the database.'
          });
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
         console.error("Firestore query error: ", error);
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not set up the appointment listener.'
          });
        setLoading(false);
      }
  }, [toast]);


    const handleAppointmentUpdate = async (updatedAppointment: Appointment) => {
        try {
            const appointmentRef = doc(db, 'appointments', updatedAppointment.id);
            await updateDoc(appointmentRef, {
                status: updatedAppointment.status
            });
            toast({
                title: "Appointment Updated",
                description: `${updatedAppointment.patientName}'s appointment set to ${updatedAppointment.status}.`,
            });
        } catch (error) {
            console.error("Error updating appointment status: ", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update appointment status.'
            });
        }
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pending = filteredAppointments.filter(a => a.status === 'pending');
    const confirmed = filteredAppointments.filter(a => a.status === 'confirmed');
    const completed = filteredAppointments.filter(a => a.status === 'completed');
    const rejected = filteredAppointments.filter(a => a.status === 'rejected');

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <CardTitle>Appointments</CardTitle>
                        <CardDescription>View and manage all patient appointments.</CardDescription>
                    </div>
                     <Input
                        placeholder="Search by patient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-xs"
                    />
                </div>
            </CardHeader>
            <CardContent>
               {loading ? (
                 <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
               ): (
                <Tabs defaultValue="pending">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                        <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
                        <TabsTrigger value="confirmed">Upcoming ({confirmed.length})</TabsTrigger>
                        <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending" className="mt-4">
                        <AppointmentsTable appointments={pending} onUpdate={handleAppointmentUpdate} />
                    </TabsContent>
                    <TabsContent value="confirmed" className="mt-4">
                        <AppointmentsTable appointments={confirmed} onUpdate={handleAppointmentUpdate} />
                    </TabsContent>
                    <TabsContent value="completed" className="mt-4">
                        <AppointmentsTable appointments={completed} onUpdate={handleAppointmentUpdate} />
                    </TabsContent>
                    <TabsContent value="rejected" className="mt-4">
                        <AppointmentsTable appointments={rejected} onUpdate={handleAppointmentUpdate} />
                    </TabsContent>
                </Tabs>
               )}
            </CardContent>
        </Card>
    );
}
