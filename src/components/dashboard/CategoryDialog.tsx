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
import type { Category } from '@/lib/types';

const categorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  icon: z.string().min(1, 'Icon is required (e.g., an emoji)'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  category?: Category;
}

export function CategoryDialog({ isOpen, setIsOpen, onSave, category }: CategoryDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (isOpen) {
        if (category) {
          reset(category);
        } else {
          reset({
            name: '',
            icon: '',
            description: '',
          });
        }
    }
  }, [category, reset, isOpen]);

  const onSubmit = (data: CategoryFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Make changes to this video category.' : 'Create a new category to group videos.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="e.g. Back Pain Relief" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input id="icon" {...register('icon')} placeholder="e.g. 🦴" />
            {errors.icon && <p className="text-red-500 text-xs">{errors.icon.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="A short description of the category..." />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
