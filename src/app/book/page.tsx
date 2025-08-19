
import { Header } from "@/components/Header";
import { BookingForm } from "@/components/book/BookingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Treatment } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { unstable_noStore as noStore } from 'next/cache';


// This is now a Server Component, so it can fetch data securely.
async function getTreatments(): Promise<Treatment[]> {
    // This prevents the data from being cached, ensuring it's always fresh.
    noStore();
    
    try {
        const treatmentsCol = collection(db, 'treatments');
        const q = query(treatmentsCol, orderBy('name'));
        const snapshot = await getDocs(q);
        const treatmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Treatment));
        return treatmentsData;
    } catch (err) {
        console.error('Error fetching treatments:', err);
        // Return an empty array or throw an error to be caught by an error boundary
        return [];
    }
}


export default async function BookAppointmentPage() {
    const treatments = await getTreatments();
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-8 sm:py-12 bg-secondary/50">
                <div className="container mx-auto px-4 md:px-6">
                    <Card className="max-w-3xl mx-auto shadow-lg">
                        <CardHeader className="text-center sm:text-left">
                            <CardTitle className="text-2xl md:text-3xl">Book Your Appointment</CardTitle>
                            <CardDescription>Complete the steps below to schedule your session with Dr. Amiya.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BookingForm treatments={treatments} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

