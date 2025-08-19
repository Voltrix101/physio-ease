
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Header } from "@/components/Header";
import type { Video } from "@/lib/types";

async function getVideo(videoId: string): Promise<Video | null> {
  const ref = doc(db, "videos", videoId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } as Video : null;
}

export default async function VideoPage({ params }: { params: { videoId: string } }) {
  const video = await getVideo(params.videoId);

  if (!video) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 flex items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-destructive">Video not found</h1>
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl">
                 <div className="w-full aspect-video mb-6 shadow-2xl rounded-xl overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={video.title}
                    />
                </div>
                <div className="w-full text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary mb-2">{video.title}</h1>
                    <div className="flex gap-2 mb-4">
                        {video.tags?.map(tag => (
                            <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <p className="text-base text-muted-foreground">{video.description}</p>
                </div>
            </div>
        </main>
         <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50 mt-12">
            <div className="container text-center text-sm px-4 md:px-6">
            © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
            </div>
        </footer>
    </div>
  );
}
