import { Header } from "@/components/Header";
import { BookingForm } from "@/components/book/BookingForm";
import { mockServices } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookAppointmentPage() {
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
                            <BookingForm treatments={mockServices} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
