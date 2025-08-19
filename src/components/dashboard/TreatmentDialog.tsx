'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Treatment } from '@/lib/types';

const treatmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  imageUrl: z.string().url('Must be a valid URL'),
  dataAiHint: z.string().optional(),
});

type TreatmentFormData = z.infer<typeof treatmentSchema>;

interface TreatmentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (treatment: Omit<Treatment, 'id'>) => void;
  treatment?: Treatment;
}

const hintToImageMap: Record<string, string> = {
    "physiotherapy manual therapy": "https://images.unsplash.com/photo-1599447462463-0599a37a67a8?q=80&w=1470&auto=format&fit=crop",
    "physiotherapy exercise training": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop",
    "physiotherapy electrotherapy": "https://images.unsplash.com/photo-1629822442426-003a71f05796?q=80&w=1470&auto=format&fit=crop",
    "physiotherapy ultrasound therapy": "https://images.unsplash.com/photo-1605793520092-231584161b4a?q=80&w=1471&auto=format&fit=crop",
    "physiotherapy hot cold therapy": "https://images.unsplash.com/photo-1576091160550-2173dba9996a?q=80&w=1470&auto=format&fit=crop",
    "physiotherapy kinesio taping": "https://images.unsplash.com/photo-1616886847038-1a2933735a11?q=80&w=1470&auto=format&fit=crop",
    "physiotherapy traction therapy": "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop",
    "physiotherapy dry needling acupuncture": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1587&auto=format&fit=crop",
    "physiotherapy neurological rehab": "https://images.unsplash.com/photo-1581092921532-7227429d35a8?q=80&w=1470&auto=format&fit=crop",
}

export function TreatmentDialog({ isOpen, setIsOpen, onSave, treatment }: TreatmentDialogProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
  });
  
  const dataAiHint = watch('dataAiHint');

  useEffect(() => {
    // When the dataAiHint changes, check if it's a key in our map.
    if (dataAiHint && hintToImageMap[dataAiHint]) {
        // If it is, update the imageUrl field with the corresponding Unsplash URL.
        setValue('imageUrl', hintToImageMap[dataAiHint]);
    }
  }, [dataAiHint, setValue]);


  useEffect(() => {
    if (isOpen) {
        if (treatment) {
          reset(treatment);
        } else {
          reset({
            name: '',
            description: '',
            price: 0,
            duration: 60,
            imageUrl: 'https://placehold.co/600x400.png',
            dataAiHint: '',
          });
        }
    }
  }, [treatment, reset, isOpen]);

  const onSubmit = (data: TreatmentFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{treatment ? 'Edit Treatment' : 'Add New Treatment'}</DialogTitle>
          <DialogDescription>
            {treatment ? 'Make changes to the existing treatment.' : 'Fill in the details for the new treatment.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
             {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" {...register('price')} />
                {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
             </div>
             <div className="grid gap-2">
                <Label htmlFor="duration">Duration (mins)</Label>
                <Input id="duration" type="number" {...register('duration')} />
                {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
            </div>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="dataAiHint">AI Image Hint</Label>
            <Input id="dataAiHint" {...register('dataAiHint')} placeholder="e.g. physiotherapy exercise" />
            <p className="text-xs text-muted-foreground">Pasting a hint from the list will auto-select an image.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" {...register('imageUrl')} />
            {errors.imageUrl && <p className="text-red-500 text-xs">{errors.imageUrl.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Treatment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
