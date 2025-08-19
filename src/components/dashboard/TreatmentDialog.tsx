
'use client';

import { useEffect, useState, useRef } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { generateImage, GenerateImage } from '@/ai/flows/generate-image-flow';
import { Loader2, Sparkles } from 'lucide-react';


const treatmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  imageUrl: z.string().url('Must be a valid URL or a data URI.'),
  dataAiHint: z.string().optional(),
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
  
  const { toast } = useToast();
  const watchedImageUrl = watch('imageUrl');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    if (isOpen) {
        if (treatment) {
          reset(treatment);
          setImagePrompt(treatment.dataAiHint || '');
        } else {
          reset({
            name: '',
            description: '',
            price: 0,
            duration: 60,
            imageUrl: 'https://placehold.co/600x400.png',
            dataAiHint: '',
          });
          setImagePrompt('');
        }
    }
  }, [treatment, reset, isOpen]);

 const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) {
                reject(new Error("Canvas not found"));
                return;
            }
            // Set canvas dimensions for compression
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                 reject(new Error("Canvas context not available"));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            // Get the compressed data URL (JPEG format is generally smaller)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
            resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
  };

 const handleGenerateImage = async () => {
    if (!imagePrompt) {
        toast({
            variant: 'destructive',
            title: "Prompt is empty",
            description: "Please enter a prompt to generate an image.",
        });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateImage({ prompt: imagePrompt });
        const compressedUrl = await compressImage(result.imageUrl);
        setValue('imageUrl', compressedUrl, { shouldValidate: true });
        toast({
            title: "Image Generated!",
            description: "The preview has been updated with the new image."
        });
    } catch (error) {
        console.error("Error generating image:", error);
        toast({
            variant: 'destructive',
            title: "Generation Failed",
            description: "Could not generate and compress the image. Please try again."
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const onSubmit = (data: TreatmentFormData) => {
    onSave({ ...data, dataAiHint: imagePrompt });
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
            <Label htmlFor="imagePrompt">Image Generation Prompt</Label>
            <div className="flex gap-2">
              <Input
                id="imagePrompt"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g., patient receiving back massage"
              />
              <Button type="button" onClick={handleGenerateImage} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Describe the image you want the AI to create.</p>
          </div>
          <div className="space-y-2">
            <Label>Image Preview</Label>
            <div className="relative h-48 w-full rounded-md border bg-muted overflow-hidden">
             {watchedImageUrl && (
                <Image src={watchedImageUrl} alt="Image preview" fill style={{ objectFit: 'cover' }} />
              )}
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (or paste a Data URI)</Label>
            <Input id="imageUrl" {...register('imageUrl')} placeholder="AI-generated images will appear here" />
            {errors.imageUrl && <p className="text-red-500 text-xs">{errors.imageUrl.message}</p>}
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Treatment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
