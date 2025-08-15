import { Header } from "@/components/Header";
import { BookingForm } from "@/components/book/BookingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Treatment } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

async function getTreatments(): Promise<Treatment[]> {
    const treatmentsCol = collection(db, 'treatments');
    const q = query(treatmentsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Treatment));
}


export default async function BookAppointmentPage() {
    const treatments = await getTreatments();
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-12 bg-secondary/50">
                <div className="container mx-auto px-4 md:px-6">
                    <Card className="max-w-3xl mx-auto shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
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
