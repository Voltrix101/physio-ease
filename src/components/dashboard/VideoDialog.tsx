
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
import type { Video } from '@/lib/types';

const videoSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  youtubeId: z.string().min(5, 'Must be a valid YouTube Video ID'),
  category: z.string().optional(),
});

type VideoFormData = z.infer<typeof videoSchema>;

interface VideoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (video: Omit<Video, 'id'>) => void;
  video?: Video;
}

export function VideoDialog({ isOpen, setIsOpen, onSave, video }: VideoDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
  });

  useEffect(() => {
    if (isOpen) {
        if (video) {
          reset(video);
        } else {
          reset({
            title: '',
            description: '',
            youtubeId: '',
            category: '',
          });
        }
    }
  }, [video, reset, isOpen]);

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
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} placeholder="e.g. Back Pain Relief" />
            {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
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
