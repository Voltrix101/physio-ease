'use client';

import { useState } from 'react';
import type { Appointment } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentsTable } from './AppointmentsTable';

interface AppointmentsListProps {
    initialAppointments: Appointment[];
}

export function AppointmentsList({ initialAppointments }: AppointmentsListProps) {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
        setAppointments(prev => prev.map(app => app.id === updatedAppointment.id ? updatedAppointment : app));
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pending = filteredAppointments.filter(a => a.status === 'pending');
    const confirmed = filteredAppointments.filter(a => a.status === 'confirmed');
    const completed = filteredAppointments.filter(a => a.status === 'completed');
    const rejected = filteredAppointments.filter(a => a.status === 'rejected');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <div className="mt-4">
                    <Input
                        placeholder="Search by patient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                        <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
                        <TabsTrigger value="confirmed">Upcoming ({confirmed.length})</TabsTrigger>
                        <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending" className="mt-4">
                        <AppointmentsTable appointments={pending} onUpdate={handleAppointmentUpdate} />
                    </TabsContent>
                    <TabsContent value="confirmed" className="mt-4">
                        <AppointmentsTable appointments={confirmed} onUpdate={handleAppointmentUpdate} />
                    </TabsContent>
                    <TabsContent value="completed" className="mt-4">
                        <AppointmentsTable appointments={completed} onUpdate={handleAppointmentUpdate} />
                    </TabsContent>
                    <TabsContent value="rejected" className="mt-4">
                        <AppointmentsTable appointments={rejected} onUpdate={handleAppointmentUpdate} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
