'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsList } from "./AppointmentsList";
import { TreatmentsList } from "./TreatmentsList";
import type { Appointment } from "@/lib/types";
import { Calendar, ListOrdered, ShoppingCart, Youtube } from "lucide-react";
import { ProductsList } from "./ProductsList";
import { VideosList } from "./VideosList";

interface DashboardClientProps {
  appointments: Appointment[];
}

export function DashboardClient({ appointments }: DashboardClientProps) {
  return (
    <Tabs defaultValue="appointments" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
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
    </Tabs>
  );
}
