'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import type { Treatment } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TreatmentDialog } from './TreatmentDialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';


export function TreatmentsList() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "treatments"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const treatmentsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Treatment));
        setTreatments(treatmentsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching treatments: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch treatments from the database.'
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleSave = async (treatment: Omit<Treatment, 'id'>) => {
    try {
        if (selectedTreatment) {
            // Edit existing treatment
            const treatmentRef = doc(db, 'treatments', selectedTreatment.id);
            await updateDoc(treatmentRef, treatment);
            toast({ title: "Treatment Updated", description: `${treatment.name} has been updated.` });
        } else {
            // Add new treatment
            await addDoc(collection(db, 'treatments'), treatment);
            toast({ title: "Treatment Added", description: `${treatment.name} has been added.` });
        }
        setIsDialogOpen(false);
        setSelectedTreatment(undefined);
    } catch (error) {
        console.error("Error saving treatment: ", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save the treatment details.'
        });
    }
  };

  const handleDelete = async (treatmentId: string) => {
     try {
        await deleteDoc(doc(db, 'treatments', treatmentId));
        toast({ title: "Treatment Deleted", variant: 'destructive', description: `The treatment has been deleted.` });
    } catch (error) {
        console.error("Error deleting treatment: ", error);
        toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description: 'Could not delete the treatment.'
        });
    }
  };
  
  const handleEdit = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsDialogOpen(true);
  }
  
  const handleAddNew = () => {
    setSelectedTreatment(undefined);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Treatments</CardTitle>
          <CardDescription>Add, edit, or remove physiotherapy treatments offered at the clinic.</CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Treatment
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration (mins)</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatments.map((treatment) => (
                  <TableRow key={treatment.id}>
                    <TableCell className="font-medium">{treatment.name}</TableCell>
                    <TableCell>{treatment.duration}</TableCell>
                    <TableCell>₹{treatment.price}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(treatment)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(treatment.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <TreatmentDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSave={handleSave}
          treatment={selectedTreatment}
        />
      </CardContent>
    </Card>
  );
}
