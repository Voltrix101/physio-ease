
import { Header } from "@/components/Header";
import { mockProducts } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-secondary/50">
                <section className="w-full bg-primary/5 py-12 md:py-20">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-3xl space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                                Recommended Products
                            </h1>
                            <p className="text-muted-foreground">
                                Dr. Amiya recommends these products to supplement your treatment and aid in your recovery. These are affiliate links, and a small commission is earned from purchases.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {mockProducts.map(product => (
                                <Card key={product.id} className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl rounded-lg">
                                    <CardHeader className="p-0">
                                        <div className="relative h-56 w-full">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                layout="fill"
                                                objectFit="cover"
                                                data-ai-hint={product.dataAiHint}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-6 space-y-2">
                                        <CardTitle className="text-lg">{product.name}</CardTitle>
                                        <CardDescription className="text-lg font-semibold text-primary">
                                            ₹{product.price}
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0 mt-auto">
                                        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                            <Link href={product.affiliateUrl} target="_blank">
                                                Order Now <ExternalLink className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
             <footer className="bg-primary text-primary-foreground py-6 border-t">
                <div className="container text-center text-sm">
                © {new Date().getFullYear()} Pain Manage Clinic. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
