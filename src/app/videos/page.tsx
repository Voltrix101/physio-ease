
'use client';

import { Header } from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { Video } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type GroupedVideos = {
    [key: string]: Video[];
};

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
    const [groupedVideos, setGroupedVideos] = useState<GroupedVideos>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getVideos() {
            try {
                const videosCol = collection(db, 'videos');
                const q = query(videosCol, orderBy('title'));
                const snapshot = await getDocs(q);
                const allVideos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
                setVideos(allVideos);

                // Assuming the first 5 are featured for the carousel
                setFeaturedVideos(allVideos.slice(0, 5));

                const groups = allVideos.reduce((acc, video) => {
                    const category = video.category || 'General';
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(video);
                    return acc;
                }, {} as GroupedVideos);
                setGroupedVideos(groups);

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
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 animate-fadeUp">
                        <h1 className="text-4xl font-headline tracking-tight text-primary">Exercise & Wellness Videos</h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Watch these videos curated by Dr. Amiya to learn more about physiotherapy techniques, exercises, and self-care for pain management.
                        </p>
                    </div>

                    {/* Featured Videos Carousel */}
                    {featuredVideos.length > 0 && (
                        <section className="mb-16 animate-fadeUp">
                            <h2 className="text-2xl font-headline text-primary mb-6 text-center">Featured Videos</h2>
                             <Carousel
                                opts={{ align: "start", loop: true }}
                                className="w-full max-w-4xl mx-auto"
                            >
                                <CarouselContent>
                                    {featuredVideos.map(video => (
                                        <CarouselItem key={video.id} className="md:basis-1/2 lg:basis-1/3">
                                            <div className="p-2">
                                                <Link href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="block group">
                                                    <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                                         <AspectRatio ratio={16/9}>
                                                            <Image
                                                                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                                                                alt={video.title}
                                                                fill
                                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                        </AspectRatio>
                                                        <div className="p-4 bg-card">
                                                            <h3 className="font-semibold text-primary truncate">{video.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{video.category}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden sm:flex" />
                                <CarouselNext className="hidden sm:flex" />
                            </Carousel>
                        </section>
                    )}

                    {/* All Videos by Category */}
                    <section className="animate-fadeUp">
                         <h2 className="text-2xl font-headline text-primary mb-6 text-center">All Exercises</h2>
                         <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                             {Object.entries(groupedVideos).map(([category, videoList]) => (
                                <AccordionItem key={category} value={category}>
                                    <AccordionTrigger className="text-lg font-headline text-primary/90 hover:text-primary transition-colors py-4">
                                        {category} ({videoList.length})
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                             {videoList.map(video => (
                                                 <Link href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" key={video.id} className="block group">
                                                    <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                                        <AspectRatio ratio={16 / 9}>
                                                            <Image 
                                                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                                                                alt={video.title} 
                                                                fill
                                                                className="object-cover"
                                                            />
                                                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                                            </div>
                                                        </AspectRatio>
                                                    </div>
                                                    <p className="mt-2 text-sm font-medium text-center text-foreground truncate" title={video.title}>{video.title}</p>
                                                 </Link>
                                             ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                             ))}
                         </Accordion>
                    </section>
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
