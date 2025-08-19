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
import type { Product } from '@/lib/types';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  affiliateUrl: z.string().url('Must be a valid affiliate URL'),
  imageUrl: z.string().min(1, 'Image is required.'), // Can be URL or data URI
  dataAiHint: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (product: Omit<Product, 'id'>) => void;
  product?: Product;
}

export function ProductDialog({ isOpen, setIsOpen, onSave, product }: ProductDialogProps) {
  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const watchedImageUrl = watch('imageUrl');
  const watchedPrompt = watch('dataAiHint');

  useEffect(() => {
    if (isOpen) {
        if (product) {
          reset(product);
        } else {
          reset({
            name: '',
            price: 0,
            affiliateUrl: '',
            imageUrl: 'https://placehold.co/300x300.png',
            dataAiHint: '',
          });
        }
    }
  }, [product, reset, isOpen]);

  const handleGenerateImage = async () => {
      if (!watchedPrompt) {
        toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a prompt to generate an image.' });
        return;
      }
      setIsGenerating(true);
      try {
        const result = await generateImage({ prompt: watchedPrompt });
        setValue('imageUrl', result.imageUrl, { shouldValidate: true });
        toast({ title: 'Image Generated!', description: 'The image has been successfully generated.' });
      } catch (error) {
        console.error("Image generation failed:", error);
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate the image.' });
      } finally {
        setIsGenerating(false);
      }
  };

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Make changes to the existing product.' : 'Fill in the details for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" type="number" {...register('price')} />
            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="affiliateUrl">Affiliate URL</Label>
            <Input id="affiliateUrl" {...register('affiliateUrl')} />
            {errors.affiliateUrl && <p className="text-red-500 text-xs">{errors.affiliateUrl.message}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="dataAiHint">Image Generation Prompt</Label>
            <div className="flex items-center gap-2">
                <Input id="dataAiHint" {...register('dataAiHint')} placeholder="e.g. photorealistic, physiotherapy equipment" />
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
             {/* The imageUrl is now managed by the form state, no need for a visible input */}
             <Input id="imageUrl" {...register('imageUrl')} type="hidden" />
             {errors.imageUrl && <p className="text-red-500 text-xs">{errors.imageUrl.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
