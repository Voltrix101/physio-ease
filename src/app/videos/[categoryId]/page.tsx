
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocs, collection, query, where, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Header } from "@/components/Header";
import type { Video, Category } from "@/lib/types";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

async function getCategory(categoryId: string): Promise<Category | null> {
  const ref = doc(db, "categories", categoryId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } as Category : null;
}

async function getVideos(categoryId: string): Promise<Video[]> {
  const q = query(collection(db, "videos"), where("categoryId", "==", categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
}

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  const category = await getCategory(params.categoryId);
  const videos = await getVideos(params.categoryId);

  if (!category) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">
            <section className="bg-secondary py-12 md:py-16 animate-fadeUp">
                <div className="container px-4 md:px-6 text-center">
                    <h1 className="text-3xl sm:text-4xl font-headline tracking-tight md:text-5xl text-primary">
                        {category.icon} {category.name}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        {category.description}
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16 px-4 md:px-6 animate-fadeUp">
                <div className="container mx-auto">
                    {videos.length === 0 ? (
                        <div className="text-center text-muted-foreground">No videos found in this category yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {videos.map((video) => (
                              <Link href={`/videos/${params.categoryId}/${video.id}`} key={video.id}>
                                  <div
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
                                      <h3 className="font-semibold truncate text-foreground" title={video.title}>{video.title}</h3>
                                      <p className="text-sm text-muted-foreground">{video.duration}</p>
                                    </div>
                                  </div>
                              </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
        <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50 mt-8">
            <div className="container text-center text-sm px-4 md:px-6">
            © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
            </div>
        </footer>
    </div>
  );
}
