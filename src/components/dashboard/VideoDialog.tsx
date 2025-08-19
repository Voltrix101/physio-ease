'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Video, Category } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';


const videoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  youtubeId: z.string().min(5, 'Must be a valid YouTube Video ID'),
  categoryId: z.string({ required_error: 'Please select a category.'}),
});

type VideoFormData = z.infer<typeof videoSchema>;

interface VideoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (video: Omit<Video, 'id'>) => void;
  video?: Video;
}

export function VideoDialog({ isOpen, setIsOpen, onSave, video }: VideoDialogProps) {
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  });
  
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isOpen) {
        if (video) {
          reset(video);
        } else {
          reset({
            title: '',
            description: '',
            youtubeId: '',
            categoryId: '',
          });
        }
    }
  }, [video, reset, isOpen]);

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categoriesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Category));
        setCategories(categoriesData);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = (data: VideoFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{video ? 'Edit Video' : 'Add New Video'}</DialogTitle>
          <DialogDescription>
            {video ? 'Make changes to the existing video link.' : 'Fill in the details for the new video.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="categoryId">Category</Label>
             <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
             {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="youtubeId">YouTube Video ID</Label>
            <Input id="youtubeId" {...register('youtubeId')} placeholder="e.g. z915K14nL8s" />
            {errors.youtubeId && <p className="text-red-500 text-xs">{errors.youtubeId.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Video</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
