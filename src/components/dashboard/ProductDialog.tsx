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
import type { Product } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  affiliateUrl: z.string().url('Must be a valid affiliate URL'),
  imageUrl: z.string().url('Must be a valid image URL'),
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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

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

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
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
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" {...register('imageUrl')} />
            {errors.imageUrl && <p className="text-red-500 text-xs">{errors.imageUrl.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataAiHint">AI Image Hint</Label>
            <Input id="dataAiHint" {...register('dataAiHint')} placeholder="e.g. physiotherapy equipment" />
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
