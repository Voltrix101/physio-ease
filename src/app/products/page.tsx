import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="flex flex-col min-h-screen bg-[#faf8f3]">
            <Header />
            <main className="flex-1">
                <section className="bg-secondary/50 py-12 md:py-20 animate-fadeUp">
                    <div className="container px-4 md:px-6 text-center">
                        <h1 className="text-4xl font-headline tracking-tight text-[#2e4a3f] sm:text-5xl">
                            Recommended Products
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            Dr. Amiya recommends these products to supplement your treatment and aid in your recovery. These are affiliate links, and a small commission is earned from purchases.
                        </p>
                    </div>
                </section>
                <section className="py-16 px-6 md:px-20 animate-fadeUp">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                             <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transform transition">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        layout="fill"
                                        objectFit="cover"
                                        data-ai-hint={product.dataAiHint}
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-headline text-xl mb-2 text-primary">{product.name}</h3>
                                    <p className="text-[#70a8a3] font-semibold mb-4">₹{product.price}</p>
                                    <a href={product.affiliateUrl} target="_blank" className="block bg-[#e0a96d] text-black text-center px-4 py-2 rounded hover:bg-[#d18f50] hover:scale-105 transform transition">
                                    Buy Now <ExternalLink className="inline-block ml-2 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
             <footer className="bg-deep-highlight text-deep-highlight-foreground py-6 border-t border-deep-highlight/50">
                <div className="container text-center text-sm">
                © {new Date().getFullYear()} PhysioEase Clinic. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
