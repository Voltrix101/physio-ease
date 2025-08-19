
import { Header } from "@/components/Header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Product } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

async function getProducts(): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export default async function ProductsPage() {
    const products = await getProducts();
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1">
                <section className="bg-secondary/50 py-12 md:py-20 animate-fadeUp">
                    <div className="container px-4 md:px-6 text-center">
                        <h1 className="text-3xl sm:text-4xl font-headline tracking-tight text-deep-highlight md:text-5xl">
                            Recommended Products
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            Dr. Amiya recommends these products to supplement your treatment and aid in your recovery. These are affiliate links, and a small commission is earned from purchases.
                        </p>
                    </div>
                </section>
                <section className="py-16 px-4 md:px-6 animate-fadeUp">
                    <div className="container mx-auto">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map(product => (
                                <div key={product.id} className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transform transition flex flex-col">
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            style={{objectFit: 'cover'}}
                                            data-ai-hint={product.dataAiHint}
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-headline text-xl mb-2 text-primary">{product.name}</h3>
                                        <p className="text-primary/90 font-semibold mb-4">₹{product.price}</p>
                                        <div className="mt-auto">
                                            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                                <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                                                    Buy Now <ExternalLink className="inline-block ml-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
             <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50">
                <div className="container text-center text-sm px-4 md:px-6">
                © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
