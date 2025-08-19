'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Loader2, Link as LinkIcon } from 'lucide-react';
import type { Video, Category } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { VideoDialog } from './VideoDialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export function VideosList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>(undefined);
  const { toast } = useToast();
  
  const categoryMap = useMemo(() => {
    return categories.reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {} as Record<string, string>);
  }, [categories]);

  useEffect(() => {
    const qVideos = query(collection(db, "videos"), orderBy("title"));
    const unsubscribeVideos = onSnapshot(qVideos, (querySnapshot) => {
        const videosData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Video));
        setVideos(videosData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching videos: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch videos from the database.'
        });
        setLoading(false);
    });
    
    const qCategories = query(collection(db, "categories"), orderBy("name"));
    const unsubscribeCategories = onSnapshot(qCategories, (snapshot) => {
        const catData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(catData);
    });

    return () => {
        unsubscribeVideos();
        unsubscribeCategories();
    };
  }, [toast]);


  const handleSave = async (video: Omit<Video, 'id'>) => {
    try {
        if (selectedVideo) {
            const videoRef = doc(db, 'videos', selectedVideo.id);
            await updateDoc(videoRef, video);
            toast({ title: "Video Updated", description: `The video link has been updated.` });
        } else {
            await addDoc(collection(db, 'videos'), video);
            toast({ title: "Video Added", description: `The video link has been added.` });
        }
        setIsDialogOpen(false);
        setSelectedVideo(undefined);
    } catch (error) {
        console.error("Error saving video: ", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save the video details.'
        });
    }
  };

  const handleDelete = async (videoId: string) => {
     try {
        await deleteDoc(doc(db, 'videos', videoId));
        toast({ title: "Video Deleted", variant: 'destructive', description: `The video has been deleted.` });
    } catch (error) {
        console.error("Error deleting video: ", error);
        toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description: 'Could not delete the video.'
        });
    }
  };
  
  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  }
  
  const handleAddNew = () => {
    setSelectedVideo(undefined);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Videos</CardTitle>
          <CardDescription>Manage embedded YouTube videos on the public videos page.</CardDescription>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : videos.length === 0 ? (
             <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No videos found. Add a video or seed initial data from the 'Categories' tab.</p>
            </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Title</TableHead>
                  <TableHead className="min-w-[150px]">Category</TableHead>
                  <TableHead>YouTube ID</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>
                        <Badge variant="secondary">{categoryMap[video.categoryId] || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{video.youtubeId}</TableCell>
                    <TableCell>
                        <Link href={`https://youtu.be/${video.youtubeId}`} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" />
                            Watch
                        </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(video)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(video.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <VideoDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSave={handleSave}
          video={selectedVideo}
        />
      </CardContent>
    </Card>
  );
}
