
import { Header } from "@/components/Header";
import { TreatmentCard } from "@/components/patient/TreatmentCard";
import type { Treatment } from "@/lib/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

async function getTreatments(): Promise<Treatment[]> {
    const treatmentsCol = collection(db, 'treatments');
    const q = query(treatmentsCol, orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Treatment));
}


export default async function ServicesPage() {
    const treatments = await getTreatments();
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1">
                <section className="bg-secondary py-12 md:py-20 animate-fadeUp">
                    <div className="container px-4 md:px-6 text-center">
                        <h1 className="text-3xl sm:text-4xl font-headline tracking-tight md:text-5xl">
                            Our Physiotherapy Services
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            We offer a comprehensive range of specialized treatments to address your specific needs and help you on your path to recovery.
                        </p>
                    </div>
                </section>

                <section className="py-16 px-4 md:px-6 animate-fadeUp">
                    <div className="container mx-auto">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {treatments.map(treatment => (
                                <TreatmentCard key={treatment.id} treatment={treatment} />
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
