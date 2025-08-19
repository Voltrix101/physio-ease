
'use client';

import { Header } from "@/components/Header";
import type { Video } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import ReactPlayer from 'react-player/youtube';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

    useEffect(() => {
        async function getVideos() {
            try {
                const videosCol = collection(db, 'videos');
                const q = query(videosCol, orderBy('title'));
                const snapshot = await getDocs(q);
                const allVideos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
                setVideos(allVideos);
                if (allVideos.length > 0) {
                    setCurrentVideo(allVideos[0]);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        }
        getVideos();
    }, []);

    if (loading) {
        return (
             <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
            </div>
        )
    }

    return (
      <div className="flex flex-col min-h-screen bg-secondary/20">
        <Header />
        <main className="flex-1 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 animate-fadeUp">
              <h1 className="text-4xl font-headline tracking-tight text-primary">Exercise & Wellness Videos</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Watch these videos curated by Dr. Amiya to learn more about physiotherapy techniques, exercises, and self-care for pain management.
              </p>
            </div>

            {currentVideo && (
              <section className="mb-12 rounded-xl bg-card shadow-2xl overflow-hidden p-4 border animate-fadeUp">
                <div className="aspect-video">
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
                    controls
                    width="100%"
                    height="100%"
                    playing={true}
                  />
                </div>
                <div className="pt-4">
                    <h2 className="text-2xl font-headline text-primary">{currentVideo.title}</h2>
                    <p className="text-muted-foreground mt-1">{currentVideo.description}</p>
                </div>
              </section>
            )}

            {videos.length > 0 && (
              <section className="animate-fadeUp">
                <h3 className="text-2xl font-headline text-primary mb-6 text-center">More Exercises</h3>
                <Carousel opts={{ align: "start", loop: videos.length > 3 }} className="w-full">
                  <CarouselContent className="-ml-4">
                    {videos.map((video) => (
                      <CarouselItem key={video.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <div
                          onClick={() => setCurrentVideo(video)}
                          className="group cursor-pointer overflow-hidden rounded-lg shadow-lg border border-border/50 hover:border-primary transition-all duration-300 transform hover:-translate-y-1 bg-card"
                        >
                          <div className="relative aspect-video">
                            <Image
                              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                              alt={video.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="h-12 w-12 text-white/80" />
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold truncate text-foreground" title={video.title}>{video.title}</h4>
                            <p className="text-sm text-muted-foreground">{video.category || 'General'}</p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              </section>
            )}
          </div>
        </main>
        <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50 mt-16">
          <div className="container text-center text-sm">
            © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
          </div>
        </footer>
      </div>
    );
}
