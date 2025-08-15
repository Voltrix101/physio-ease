'use client';

import { useEffect, useState } from 'react';
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, HelpCircle, Info, XCircle } from "lucide-react";
import type { Timestamp } from 'firebase/firestore';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onUpdate: (appointment: Appointment) => void;
}

const statusConfig = {
    pending: { label: "Pending", variant: "secondary", icon: HelpCircle },
    confirmed: { label: "Confirmed", variant: "default", icon: CheckCircle, className: "bg-blue-500 hover:bg-blue-600" },
    completed: { label: "Completed", variant: "default", icon: CheckCircle, className: "bg-green-500 hover:bg-green-600" },
    rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
};

function FormattedDate({ date }: { date: Date | Timestamp }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Should run only on the client
    const jsDate = date instanceof Date ? date : date.toDate();
    setFormattedDate(new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(jsDate));
  }, [date]);

  return <>{formattedDate}</>;
}


export function AppointmentsTable({ appointments, onUpdate }: AppointmentsTableProps) {
  
  const handleStatusChange = (appointment: Appointment, status: AppointmentStatus) => {
    const updatedAppointment = { ...appointment, status };
    onUpdate(updatedAppointment);
  };

  if (appointments.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No appointments found in this category.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const currentStatus = statusConfig[appointment.status];
            return (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.patientName}</TableCell>
                <TableCell>{appointment.treatmentName}</TableCell>
                <TableCell>
                  <FormattedDate date={appointment.date} />
                </TableCell>
                <TableCell>
                  {appointment.status === 'pending' && appointment.paymentVerification && (
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant={appointment.paymentVerification.paymentConfirmationSuggested ? 'default' : 'destructive'} className={appointment.paymentVerification.paymentConfirmationSuggested ? "bg-green-500 hover:bg-green-600" : ""}>
                             {appointment.paymentVerification.paymentConfirmationSuggested ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                             AI Suggestion
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs"><Info className="inline-block mr-2 h-4 w-4" />{appointment.paymentVerification.reason}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {appointment.status !== 'pending' && <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  <Badge variant={currentStatus.variant as any} className={currentStatus.className}>{currentStatus.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    {appointment.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white" onClick={() => handleStatusChange(appointment, 'confirmed')}>Accept</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleStatusChange(appointment, 'rejected')}>Reject</Button>
                        </div>
                    )}
                    {appointment.status === 'confirmed' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(appointment, 'completed')}>Mark as Completed</Button>
                    )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
