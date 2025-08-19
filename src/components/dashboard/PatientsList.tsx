
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Download, Loader2 } from 'lucide-react';
import type { Appointment } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, type Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface PatientRecord {
  id: string; // patientId
  name: string;
  lastVisit: Date;
  treatmentName: string;
  appointmentCount: number;
}


function FormattedDate({ date }: { date: Date | Timestamp }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Should run only on the client
    const jsDate = date instanceof Date ? date : date.toDate();
    setFormattedDate(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(jsDate));
  }, [date]);

  return <>{formattedDate}</>;
}


export function PatientsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const appointmentsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: (doc.data().date as Timestamp).toDate(),
        } as Appointment));
        setAppointments(appointmentsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching patient data: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch patient data.'
        });
        setLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);
  
  const patients = useMemo(() => {
    const patientMap = new Map<string, PatientRecord>();
    
    appointments.forEach(app => {
        const existingPatient = patientMap.get(app.patientId);
        if (!existingPatient || (app.date as Date) > existingPatient.lastVisit) {
            patientMap.set(app.patientId, {
                id: app.patientId,
                name: app.patientName,
                lastVisit: app.date as Date,
                treatmentName: app.treatmentName,
                appointmentCount: (existingPatient?.appointmentCount || 0) + 1
            });
        } else {
             patientMap.set(app.patientId, {
                ...existingPatient,
                appointmentCount: existingPatient.appointmentCount + 1,
            });
        }
    });

    return Array.from(patientMap.values());
  }, [appointments]);


  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Patients</CardTitle>
          <CardDescription>Manage your patient records based on their appointments.</CardDescription>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
           <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
       {loading ? (
         <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
       ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Total Appointments</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Last Treatment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No patients found.
                    </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map(patient => (
                    <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.appointmentCount}</TableCell>
                    <TableCell><FormattedDate date={patient.lastVisit} /></TableCell>
                    <TableCell>{patient.treatmentName}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
       )}
      </CardContent>
    </Card>
  );
}
