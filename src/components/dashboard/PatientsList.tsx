'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Download, Loader2, Trash2, ShieldAlert } from 'lucide-react';
import type { Appointment, PatientRecord } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, type Timestamp, writeBatch, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


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
  const [isDeleting, setIsDeleting] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<PatientRecord | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const appointmentsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate(),
          } as Appointment;
        });
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
    const patientMap: { [key: string]: { name: string; appointments: Appointment[] } } = {};
    appointments.forEach(app => {
      if (!patientMap[app.patientId]) {
        patientMap[app.patientId] = {
          name: app.patientName,
          appointments: []
        };
      }
      patientMap[app.patientId].appointments.push(app);
    });

    const patientRecords: PatientRecord[] = Object.keys(patientMap).map(patientId => {
      const patient = patientMap[patientId];
      const sortedAppointments = [...patient.appointments].sort((a, b) => b.date.getTime() - a.date.getTime());
      const lastAppointment = sortedAppointments[0];

      return {
        id: patientId,
        name: patient.name,
        appointmentCount: patient.appointments.length,
        lastVisit: lastAppointment.date,
        treatmentName: lastAppointment.treatmentName,
      };
    });

    return patientRecords.sort((a, b) => b.lastVisit.getTime() - a.lastVisit.getTime());
  }, [appointments]);

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;

    setIsDeleting(true);
    try {
        const appointmentsQuery = query(collection(db, 'appointments'), where('patientId', '==', patientToDelete.id));
        const querySnapshot = await getDocs(appointmentsQuery);
        
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        toast({
            title: 'Patient Deleted',
            description: `All records for ${patientToDelete.name} have been removed.`,
        });
    } catch (error) {
        console.error('Error deleting patient records:', error);
        toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: 'Could not delete patient records. Please try again.',
        });
    } finally {
        setIsDeleting(false);
        setPatientToDelete(null);
    }
  };


  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => setPatientToDelete(patient)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Patient
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
    
    <AlertDialog open={!!patientToDelete} onOpenChange={(open) => !open && setPatientToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-6 w-6 text-destructive" />
                    Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete all appointment records for <strong>{patientToDelete?.name}</strong>. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPatientToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={handleDeletePatient} 
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive/90"
                >
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Yes, delete patient
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
