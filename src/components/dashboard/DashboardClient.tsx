
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsList } from "./AppointmentsList";
import { TreatmentsList } from "./TreatmentsList";
import type { Appointment } from "@/lib/types";
import { Calendar, ListOrdered, ShoppingCart, Youtube, Star } from "lucide-react";
import { ProductsList } from "./ProductsList";
import { VideosList } from "./VideosList";
import { TestimonialsList } from './TestimonialsList';

interface DashboardClientProps {
  appointments: Appointment[];
}

export function DashboardClient({ appointments }: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'appointments';

  const handleTabChange = (value: string) => {
    // Use Next.js router to update the URL without a page reload
    router.push(`${pathname}?tab=${value}`, { scroll: false });
  };

  // Using `defaultValue` ensures the initial state is correct on page load.
  // `onValueChange` handles all subsequent clicks, updating the URL.
  // This combination prevents the component from re-triggering a full render cycle.
  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="appointments">
          <Calendar className="mr-2 h-4 w-4" />
          Appointments
        </TabsTrigger>
        <TabsTrigger value="treatments">
          <ListOrdered className="mr-2 h-4 w-4" />
          Treatments
        </TabsTrigger>
        <TabsTrigger value="products">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Products
        </TabsTrigger>
        <TabsTrigger value="videos">
          <Youtube className="mr-2 h-4 w-4" />
          Videos
        </TabsTrigger>
         <TabsTrigger value="testimonials">
          <Star className="mr-2 h-4 w-4" />
          Testimonials
        </TabsTrigger>
      </TabsList>
      <TabsContent value="appointments" className="mt-6">
        <AppointmentsList initialAppointments={appointments} />
      </TabsContent>
      <TabsContent value="treatments" className="mt-6">
        <TreatmentsList />
      </TabsContent>
      <TabsContent value="products" className="mt-6">
        <ProductsList />
      </TabsContent>
      <TabsContent value="videos" className="mt-6">
        <VideosList />
      </TabsContent>
       <TabsContent value="testimonials" className="mt-6">
        <TestimonialsList />
      </TabsContent>
    </Tabs>
  );
}
