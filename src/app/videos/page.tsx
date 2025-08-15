import { Header } from "@/components/Header";
import { mockVideos } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function VideosPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-12 bg-secondary/50">
                <div className="container mx-auto px-4 md:px-6">
                     <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Informative Videos</h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Watch these videos curated by Dr. Amiya to learn more about physiotherapy techniques, exercises, and self-care for pain management.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                        {mockVideos.map(video => (
                            <Card key={video.id}>
                                <CardHeader>
                                    <AspectRatio ratio={16 / 9}>
                                        <iframe
                                            className="w-full h-full rounded-md"
                                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </AspectRatio>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle>{video.title}</CardTitle>
                                    <CardDescription className="mt-2">{video.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="bg-primary text-primary-foreground py-6 border-t">
                <div className="container text-center text-sm">
                © {new Date().getFullYear()} Pain Manage Clinic. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
