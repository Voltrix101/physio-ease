'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Loader2, Database } from 'lucide-react';
import type { Category } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CategoryDialog } from './CategoryDialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { seedVideosAndCategories } from '@/lib/seed';


export function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categoriesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Category));
        setCategories(categoriesData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching categories: ", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch categories from the database.'
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


  const handleSave = async (category: Omit<Category, 'id'>) => {
    try {
        if (selectedCategory) {
            const categoryRef = doc(db, 'categories', selectedCategory.id);
            await updateDoc(categoryRef, category);
            toast({ title: "Category Updated", description: `The category has been updated.` });
        } else {
            await addDoc(collection(db, 'categories'), category);
            toast({ title: "Category Added", description: `A new category has been added.` });
        }
        setIsDialogOpen(false);
        setSelectedCategory(undefined);
    } catch (error) {
        console.error("Error saving category: ", error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: 'Could not save the category details.'
        });
    }
  };

  const handleDelete = async (categoryId: string) => {
     try {
        await deleteDoc(doc(db, 'categories', categoryId));
        toast({ title: "Category Deleted", variant: 'destructive', description: `The category has been deleted.` });
    } catch (error) {
        console.error("Error deleting category: ", error);
        toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description: 'Could not delete the category.'
        });
    }
  };
  
   const handleSeed = async () => {
    setIsSeeding(true);
    try {
        await seedVideosAndCategories();
        toast({
            title: "Database Seeded!",
            description: "The initial video categories and videos have been added."
        });
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Seeding Failed',
            description: 'Could not add the initial data.'
        });
        console.error("Error seeding data: ", error);
    } finally {
        setIsSeeding(false);
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  }
  
  const handleAddNew = () => {
    setSelectedCategory(undefined);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Video Categories</CardTitle>
          <CardDescription>Manage the categories for organizing your video library.</CardDescription>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : categories.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">Your categories list is empty.</p>
                <Button onClick={handleSeed} disabled={isSeeding}>
                    {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                    {isSeeding ? 'Seeding...' : 'Seed Videos & Categories'}
                </Button>
            </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Icon</TableHead>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="text-2xl">{category.icon}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-md truncate">{category.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(category.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <CategoryDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSave={handleSave}
          category={selectedCategory}
        />
      </CardContent>
    </Card>
  );
}
