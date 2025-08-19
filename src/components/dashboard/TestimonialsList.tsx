
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TestimonialDialog } from './TestimonialDialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';


export function TestimonialsList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const testimonialsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Testimonial));
        setTestimonials(testimonialsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching testimonials: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch testimonials from the database.'
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleSave = async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
        if (selectedTestimonial) {
            const testimonialRef = doc(db, 'testimonials', selectedTestimonial.id);
            await updateDoc(testimonialRef, testimonial);
            toast({ title: "Testimonial Updated", description: `The testimonial has been updated.` });
        } else {
            await addDoc(collection(db, 'testimonials'), testimonial);
            toast({ title: "Testimonial Added", description: `A new testimonial has been added.` });
        }
        setIsDialogOpen(false);
        setSelectedTestimonial(undefined);
    } catch (error) {
        console.error("Error saving testimonial: ", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save the testimonial details.'
        });
    }
  };

  const handleDelete = async (testimonialId: string) => {
     try {
        await deleteDoc(doc(db, 'testimonials', testimonialId));
        toast({ title: "Testimonial Deleted", variant: 'destructive', description: `The testimonial has been deleted.` });
    } catch (error) {
        console.error("Error deleting testimonial: ", error);
        toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description: 'Could not delete the testimonial.'
        });
    }
  };
  
  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDialogOpen(true);
  }
  
  const handleAddNew = () => {
    setSelectedTestimonial(undefined);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Testimonials</CardTitle>
          <CardDescription>Manage patient testimonials displayed on the public homepage.</CardDescription>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
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
                  <TableHead className="min-w-[150px]">Patient Name</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell className="max-w-md truncate">"{testimonial.quote}"</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(testimonial)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(testimonial.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <TestimonialDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSave={handleSave}
          testimonial={selectedTestimonial}
        />
      </CardContent>
    </Card>
  );
}
