'use client';

import { Header } from "@/components/Header";
import { BookingForm } from "@/components/book/BookingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Treatment } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function BookAppointmentPage() {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        async function fetchTreatments() {
            try {
                const treatmentsCol = collection(db, 'treatments');
                const q = query(treatmentsCol, orderBy('name'));
                const snapshot = await getDocs(q);
                const treatmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Treatment));
                setTreatments(treatmentsData);
            } catch (err) {
                console.error('Error fetching treatments:', err);
                setError('Failed to load treatments. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            fetchTreatments();
        }
    }, [authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 py-12 bg-secondary/50 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading...</span>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 py-12 bg-secondary/50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        );
    }
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
