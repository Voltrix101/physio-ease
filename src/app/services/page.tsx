
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
        <div className="flex flex-col min-h-screen bg-[#faf8f3]">
            <Header />
            <main className="flex-1">
                <section className="bg-secondary/50 py-12 md:py-20 animate-fadeUp">
                    <div className="container px-4 md:px-6 text-center">
                        <h1 className="text-4xl font-headline tracking-tight text-[#2e4a3f] sm:text-5xl">
                            Our Physiotherapy Services
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            We offer a range of specialized treatments to help you on your journey to recovery and wellness. Each service is tailored to your individual needs.
                        </p>
                    </div>
                </section>
                <section className="py-16 px-6 md:px-20 animate-fadeUp">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {treatments.map(treatment => (
                            <TreatmentCard key={treatment.id} treatment={treatment} />
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
