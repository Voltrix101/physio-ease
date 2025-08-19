
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
import type { Testimonial } from '@/lib/types';

const testimonialSchema = z.object({
  name: z.string().min(2, 'Patient name must be at least 2 characters'),
  quote: z.string().min(10, 'Quote must be at least 10 characters'),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

interface TestimonialDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (testimonial: Omit<Testimonial, 'id'>) => void;
  testimonial?: Testimonial;
}

export function TestimonialDialog({ isOpen, setIsOpen, onSave, testimonial }: TestimonialDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
  });

  useEffect(() => {
    if (isOpen) {
        if (testimonial) {
          reset(testimonial);
        } else {
          reset({
            name: '',
            quote: '',
          });
        }
    }
  }, [testimonial, reset, isOpen]);

  const onSubmit = (data: TestimonialFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
          <DialogDescription>
            {testimonial ? 'Make changes to the existing testimonial.' : 'Fill in the details for the new testimonial.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Patient Name</Label>
            <Input id="name" {...register('name')} placeholder="e.g. Rohan S."/>
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea id="quote" {...register('quote')} placeholder="e.g. A wonderful experience..."/>
             {errors.quote && <p className="text-red-500 text-xs">{errors.quote.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Testimonial</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
