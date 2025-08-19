'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Treatment } from '@/lib/types';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const treatmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  imageUrl: z.string().url('Must be a valid URL'),
  dataAiHint: z.string().optional(), // This will now be used as the prompt
});

type TreatmentFormData = z.infer<typeof treatmentSchema>;

interface TreatmentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (treatment: Omit<Treatment, 'id'>) => void;
  treatment?: Treatment;
}

export function TreatmentDialog({ isOpen, setIsOpen, onSave, treatment }: TreatmentDialogProps) {
  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const watchedImageUrl = watch('imageUrl');
  const watchedPrompt = watch('dataAiHint');


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
  
  const handleGenerateImage = async () => {
      if (!watchedPrompt) {
        toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a prompt to generate an image.' });
        return;
      }
      setIsGenerating(true);
      try {
        const result = await generateImage({ prompt: watchedPrompt });
        setValue('imageUrl', result.imageUrl, { shouldValidate: true });
        toast({ title: 'Image Generated!', description: 'The image has been successfully generated and updated.' });
      } catch (error) {
        console.error("Image generation failed:", error);
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate the image.' });
      } finally {
        setIsGenerating(false);
      }
  };


  const onSubmit = (data: TreatmentFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
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
           <div className="space-y-2">
            <Label htmlFor="dataAiHint">Image Generation Prompt</Label>
            <div className="flex items-center gap-2">
                <Input id="dataAiHint" {...register('dataAiHint')} placeholder="e.g. photorealistic, physiotherapy exercise for back pain" />
                <Button type="button" onClick={handleGenerateImage} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                  Generate
                </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image Preview</Label>
            <div className="relative h-48 w-full rounded-md border bg-muted overflow-hidden">
             {watchedImageUrl && (
                <Image src={watchedImageUrl} alt="Generated image preview" fill style={{ objectFit: 'cover' }} />
              )}
            </div>
             <Input id="imageUrl" {...register('imageUrl')} className="hidden" />
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
