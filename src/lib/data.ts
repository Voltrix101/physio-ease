import type { Appointment } from './types';

export const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    patientName: 'Alice Johnson',
    treatmentName: 'Deep Tissue Massage',
    date: new Date('2024-08-15T10:00:00'),
    status: 'pending',
    paymentProof: 'TXN123456',
    createdAt: new Date('2024-08-01T14:20:00'),
    paymentVerification: {
      paymentConfirmationSuggested: true,
      reason: 'Transaction ID format appears valid and matches typical payment processor formats.'
    }
  },
];
