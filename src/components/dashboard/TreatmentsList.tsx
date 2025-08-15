'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import type { Treatment } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TreatmentDialog } from './TreatmentDialog';
import { useToast } from '@/hooks/use-toast';

interface TreatmentsListProps {
  initialTreatments: Treatment[];
}

export function TreatmentsList({ initialTreatments }: TreatmentsListProps) {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | undefined>(undefined);
  const { toast } = useToast();

  const handleSave = (treatment: Treatment) => {
    if (selectedTreatment) {
      // Edit
      setTreatments(treatments.map(t => t.id === treatment.id ? treatment : t));
       toast({ title: "Treatment Updated", description: `${treatment.name} has been updated.` });
    } else {
      // Add
      setTreatments([...treatments, { ...treatment, id: `treat-${Date.now()}` }]);
       toast({ title: "Treatment Added", description: `${treatment.name} has been added.` });
    }
    setSelectedTreatment(undefined);
  };

  const handleDelete = (treatmentId: string) => {
    setTreatments(treatments.filter(t => t.id !== treatmentId));
     toast({ title: "Treatment Deleted", variant: 'destructive', description: `The treatment has been deleted.` });
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
          <CardDescription>Add, edit, or remove physiotherapy treatments.</CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Treatment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration (mins)</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatments.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell className="font-medium">{treatment.name}</TableCell>
                  <TableCell>{treatment.duration}</TableCell>
                  <TableCell>${treatment.price}</TableCell>
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
