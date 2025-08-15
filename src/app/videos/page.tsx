import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { Video } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

async function getVideos(): Promise<Video[]> {
    const videosCol = collection(db, 'videos');
    const q = query(videosCol, orderBy('title'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
}

export default async function VideosPage() {
    const videos = await getVideos();
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-12 md:py-16 bg-secondary">
                <div className="container mx-auto px-4 md:px-6">
                     <div className="text-center mb-12">
                        <h1 className="text-4xl font-headline tracking-tight text-primary">Informative Videos</h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Watch these videos curated by Dr. Amiya to learn more about physiotherapy techniques, exercises, and self-care for pain management.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                        {videos.map(video => (
                            <Card key={video.id} className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <CardHeader className="p-0">
                                    <AspectRatio ratio={16 / 9}>
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </AspectRatio>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <CardTitle className="font-headline text-primary">{video.title}</CardTitle>
                                    <CardDescription className="mt-2 text-muted-foreground">{video.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
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
