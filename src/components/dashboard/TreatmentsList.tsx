
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Loader2, Database } from 'lucide-react';
import type { Treatment } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TreatmentDialog } from './TreatmentDialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { seedTreatments } from '@/lib/seed';


export function TreatmentsList() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
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
  
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
        await seedTreatments();
        toast({
            title: "Database Seeded!",
            description: "The initial list of treatments has been added."
        });
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Seeding Failed',
            description: 'Could not add the initial treatments.'
        });
        console.error("Error seeding database: ", error);
    } finally {
        setIsSeeding(false);
    }
  }

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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Treatments</CardTitle>
          <CardDescription>Add, edit, or remove physiotherapy treatments offered at the clinic.</CardDescription>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Treatment
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : treatments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Your treatments list is empty.</p>
                <Button onClick={handleSeed} disabled={isSeeding}>
                    {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                    {isSeeding ? 'Seeding...' : 'Seed Initial Treatments'}
                </Button>
            </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[300px]">Description</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatments.map((treatment) => (
                  <TableRow key={treatment.id}>
                    <TableCell className="font-medium">{treatment.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{treatment.description}</TableCell>
                    <TableCell>{treatment.duration} mins</TableCell>
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
