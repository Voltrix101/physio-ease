import { Header } from "@/components/Header";
import { mockProducts } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Tag } from "lucide-react";

export default function ProductsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-12 bg-secondary/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Recommended Products</h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Dr. Amiya recommends these products to supplement your treatment and aid in your recovery. These are affiliate links, and a small commission is earned from purchases.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {mockProducts.map(product => (
                            <Card key={product.id} className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                                <CardHeader className="p-0">
                                     <div className="relative h-64 w-full">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            layout="fill"
                                            objectFit="cover"
                                            data-ai-hint={product.dataAiHint}
                                        />
                                    </div>
                                    <div className="p-6">
                                        <CardTitle>{product.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow p-6 pt-0">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                                        <Tag className="h-5 w-5" />
                                        <span>₹{product.price}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 bg-primary/5">
                                    <Button asChild className="w-full">
                                        <Link href={product.affiliateUrl} target="_blank">
                                            Order Now <ExternalLink className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
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
