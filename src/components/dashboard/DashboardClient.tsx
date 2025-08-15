'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsList } from "./AppointmentsList";
import { TreatmentsList } from "./TreatmentsList";
import type { Appointment } from "@/lib/types";
import { Calendar, ListOrdered } from "lucide-react";

interface DashboardClientProps {
  appointments: Appointment[];
}

export function DashboardClient({ appointments }: DashboardClientProps) {
  return (
    <Tabs defaultValue="appointments" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="appointments">
          <Calendar className="mr-2 h-4 w-4" />
          Appointments
        </TabsTrigger>
        <TabsTrigger value="treatments">
          <ListOrdered className="mr-2 h-4 w-4" />
          Treatments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="appointments" className="mt-6">
        <AppointmentsList initialAppointments={appointments} />
      </TabsContent>
      <TabsContent value="treatments" className="mt-6">
        <TreatmentsList />
      </TabsContent>
    </Tabs>
  );
}
