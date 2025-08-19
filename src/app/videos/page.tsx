
import { Header } from "@/components/Header";
import type { Video, Category } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from 'next/link';

async function getCategories(): Promise<Category[]> {
    const categoriesCol = collection(db, 'categories');
    const snapshot = await getDocs(query(categoriesCol, orderBy('name')));
    
    const categories = await Promise.all(snapshot.docs.map(async (doc) => {
        const category = { id: doc.id, ...doc.data() } as Category;
        // Get video count for each category
        const videosQuery = query(collection(db, 'videos'), where('categoryId', '==', category.id));
        const videosSnapshot = await getDocs(videosQuery);
        category.videoCount = videosSnapshot.size;
        return category;
    }));
    
    return categories;
}

export default async function VideosPage() {
    const categories = await getCategories();

    return (
      <div className="flex flex-col min-h-screen bg-secondary/20">
        <Header />
        <main className="flex-1 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 animate-fadeUp">
              <h1 className="text-3xl sm:text-4xl font-headline tracking-tight text-primary md:text-5xl">Exercise & Wellness Library</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Browse our curated video library by category to find exercises that suit your recovery needs.
              </p>
            </div>

            <section className="animate-fadeUp">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {categories.map((cat) => (
                        <Link href={`/videos/${cat.id}`} key={cat.id}>
                          <div className="group bg-card rounded-2xl p-4 sm:p-6 shadow-lg border border-border/50 hover:border-primary/50 hover:shadow-primary/10 hover:scale-105 transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center aspect-square">
                            <span className="text-4xl sm:text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                            <h3 className="text-base sm:text-lg font-headline font-semibold text-primary">{cat.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{cat.videoCount} videos</p>
                          </div>
                        </Link>
                    ))}
                </div>
            </section>
          </div>
        </main>
        <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50 mt-16">
          <div className="container text-center text-sm px-4 md:px-6">
            © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
          </div>
        </footer>
      </div>
    );
}
