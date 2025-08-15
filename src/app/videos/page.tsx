import { Header } from "@/components/Header";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Video } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Image from "next/image";

async function getVideos(): Promise<Video[]> {
    const videosCol = collection(db, 'videos');
    const q = query(videosCol, orderBy('title'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
}

export default async function VideosPage() {
    const videos = await getVideos();
    return (
        <div className="flex flex-col min-h-screen bg-[#faf8f3]">
            <Header />
            <main className="flex-1 py-16 px-6 md:px-20 animate-fadeUp">
                 <div className="text-center mb-12">
                    <h1 className="text-4xl font-headline tracking-tight text-[#2e4a3f]">Exercise & Wellness Videos</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Watch these videos curated by Dr. Amiya to learn more about physiotherapy techniques, exercises, and self-care for pain management.
                    </p>
                </div>

                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                    {videos.map(video => (
                        <div key={video.id} className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition cursor-pointer">
                             <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer">
                                <AspectRatio ratio={16/9}>
                                    <Image 
                                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} 
                                        alt={video.title} 
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-300 group-hover:scale-105"
                                    />
                                </AspectRatio>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-3xl opacity-0 group-hover:opacity-100 transition">
                                    ▶
                                </div>
                             </a>
                        </div>
                    ))}
                </div>
            </main>
            <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50">
                <div className="container text-center text-sm">
                © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
