
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Search, Shuffle } from "lucide-react";
import { Dialog } from "@headlessui/react";
import type { Video, Category } from "@/lib/types";
import { Header } from "@/components/Header";
import Link from "next/link";


export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // fetch videos + categories
  useEffect(() => {
    const fetchData = async () => {
      const videosQuery = query(collection(db, 'videos'), orderBy("title"));
      const categoriesQuery = query(collection(db, 'categories'), orderBy("name"));

      const videoSnap = await getDocs(videosQuery);
      const categorySnap = await getDocs(categoriesQuery);

      setVideos(videoSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Video[]);
      setCategories(categorySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Category[]);
    };
    fetchData();
  }, []);

  // search filter
  useEffect(() => {
    if (!search) {
      setFiltered(videos);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        videos.filter(
          (v) =>
            v.title.toLowerCase().includes(lower) ||
            v.categoryId.toLowerCase().includes(lower) ||
            v.tags?.some((tag) => tag.toLowerCase().includes(lower))
        )
      );
    }
  }, [search, videos]);

  // shuffle random videos
  const shuffleVideos = () => {
    const shuffled = [...videos].sort(() => Math.random() - 0.5);
    setFiltered(shuffled);
  };
  
  useEffect(() => {
    shuffleVideos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-foreground">
          <h1 className="text-3xl sm:text-4xl font-headline tracking-tight text-primary md:text-5xl text-center mb-4">Exercise & Wellness Library</h1>
          <p className="mb-8 text-muted-foreground text-center max-w-3xl mx-auto">
            Browse our curated library or use the shuffle button to discover random exercises tailored for your recovery.
          </p>

          {/* Search + Shuffle */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search videos by title, category, or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-border 
                  bg-card 
                  text-foreground
                  placeholder-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={shuffleVideos}
              className="flex items-center justify-center px-5 py-2 rounded-full 
                bg-accent hover:bg-accent/90
                text-accent-foreground transition-transform hover:scale-105"
            >
              <Shuffle className="mr-2" size={18} /> Shuffle Videos
            </button>
          </div>

          {/* Featured Videos Grid */}
          <h2 className="text-2xl font-headline font-semibold mb-6 text-center">Featured Videos</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {filtered.slice(0, 8).map((video) => (
              <motion.div
                key={video.id}
                className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group
                  bg-card border border-border/50
                  hover:border-primary/50 hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => setSelectedVideo(video)}
                layout
              >
                <div className="relative">
                  <img src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} alt={video.title} className="w-full h-40 object-cover" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground truncate">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Categories */}
           <h2 className="text-2xl font-headline font-semibold mb-6 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categories.map((cat) => (
                    <Link href={`#`} key={cat.id} onClick={() => setSearch(cat.name)}>
                      <div className="group bg-card rounded-2xl p-4 sm:p-6 shadow-lg border border-border/50 hover:border-primary/50 hover:shadow-primary/10 hover:scale-105 transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center aspect-square">
                        <span className="text-4xl sm:text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                        <h3 className="text-base sm:text-lg font-headline font-semibold text-primary">{cat.name}</h3>
                      </div>
                    </Link>
                ))}
            </div>
        </div>
      </main>

       {/* Video Modal */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onClose={() => setSelectedVideo(null)} className="relative z-50">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel as={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="rounded-xl p-4 sm:p-6 max-w-3xl w-full 
              bg-card dark:bg-card 
              text-foreground"
            >
              <Dialog.Title as="h3" className="text-xl font-headline font-semibold mb-3 text-primary">{selectedVideo.title}</Dialog.Title>
              <div className="aspect-video mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
              </div>
              <p className="text-muted-foreground mb-4">{selectedVideo.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedVideo.tags?.map(tag => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="mt-2 px-4 py-2 bg-accent rounded-lg hover:bg-accent/90 text-accent-foreground"
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50 mt-16">
        <div className="container text-center text-sm px-4 md:px-6">
          © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
