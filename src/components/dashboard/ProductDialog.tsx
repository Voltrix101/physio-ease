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
import { useToast } from '@/hooks/use-toast';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Loader2, Sparkles } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  affiliateUrl: z.string().url('Must be a valid affiliate URL'),
  imageUrl: z.string().url('Must be a valid URL or a data URI'),
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
  
  const { toast } = useToast();
  const watchedImageUrl = watch('imageUrl');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');

  useEffect(() => {
    if (isOpen) {
        if (product) {
          reset(product);
          setImagePrompt(product.dataAiHint || '');
        } else {
          reset({
            name: '',
            price: 0,
            affiliateUrl: '',
            imageUrl: 'https://placehold.co/300x300.png',
            dataAiHint: '',
          });
          setImagePrompt('');
        }
    }
  }, [product, reset, isOpen]);

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
        setValue('imageUrl', result.imageUrl, { shouldValidate: true });
        toast({
            title: "Image Generated!",
            description: "The preview has been updated with the new image."
        });
    } catch (error) {
        console.error("Error generating image:", error);
        toast({
            variant: 'destructive',
            title: "Generation Failed",
            description: "Could not generate the image. Please try again."
        });
    } finally {
        setIsGenerating(false);
    }
  };


  const onSubmit = (data: ProductFormData) => {
    onSave({ ...data, dataAiHint: imagePrompt });
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
            <Label htmlFor="imagePrompt">Image Generation Prompt</Label>
            <div className="flex gap-2">
              <Input
                id="imagePrompt"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g., blue yoga mat on a wooden floor"
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
                <Image src={watchedImageUrl} alt="Generated image preview" fill style={{ objectFit: 'cover' }} />
              )}
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (or paste a Data URI)</Label>
            <Input id="imageUrl" {...register('imageUrl')} placeholder="AI-generated images will appear here" />
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
