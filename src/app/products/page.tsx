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
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <section className="w-full bg-secondary py-12 md:py-20">
                    <div className="container px-4 md:px-6 text-center">
                        <h1 className="text-4xl font-headline tracking-tight text-primary sm:text-5xl">
                            Recommended Products
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            Dr. Amiya recommends these products to supplement your treatment and aid in your recovery. These are affiliate links, and a small commission is earned from purchases.
                        </p>
                    </div>
                </section>
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map(product => (
                                <Card key={product.id} className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 rounded-lg border bg-card">
                                    <CardHeader className="p-0">
                                        <div className="relative h-56 w-full">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                layout="fill"
                                                objectFit="cover"
                                                data-ai-hint={product.dataAiHint}
                                                className="rounded-t-lg"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-6 space-y-2">
                                        <CardTitle className="text-lg font-headline text-primary">{product.name}</CardTitle>
                                        <CardDescription className="text-lg font-semibold text-primary/80">
                                            ₹{product.price}
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0 mt-auto">
                                        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                            <Link href={product.affiliateUrl} target="_blank">
                                                Buy Now <ExternalLink className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
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
