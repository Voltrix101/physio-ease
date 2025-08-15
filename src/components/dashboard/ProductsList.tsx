'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Loader2, ExternalLink } from 'lucide-react';
import type { Product } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProductDialog } from './ProductDialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';


export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Product));
        setProducts(productsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching products: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch products from the database.'
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleSave = async (product: Omit<Product, 'id'>) => {
    try {
        if (selectedProduct) {
            const productRef = doc(db, 'products', selectedProduct.id);
            await updateDoc(productRef, product);
            toast({ title: "Product Updated", description: `${product.name} has been updated.` });
        } else {
            await addDoc(collection(db, 'products'), product);
            toast({ title: "Product Added", description: `${product.name} has been added.` });
        }
        setIsDialogOpen(false);
        setSelectedProduct(undefined);
    } catch (error) {
        console.error("Error saving product: ", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save the product details.'
        });
    }
  };

  const handleDelete = async (productId: string) => {
     try {
        await deleteDoc(doc(db, 'products', productId));
        toast({ title: "Product Deleted", variant: 'destructive', description: `The product has been deleted.` });
    } catch (error) {
        console.error("Error deleting product: ", error);
        toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description: 'Could not delete the product.'
        });
    }
  };
  
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }
  
  const handleAddNew = () => {
    setSelectedProduct(undefined);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage affiliate products displayed on the public products page.</CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Affiliate Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>
                        <Link href={product.affiliateUrl} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Visit Link
                        </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <ProductDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSave={handleSave}
          product={selectedProduct}
        />
      </CardContent>
    </Card>
  );
}
