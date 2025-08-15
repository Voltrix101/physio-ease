import type { VerifyPaymentProofOutput } from "@/ai/flows/verify-payment-proof";

export interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  imageUrl: string;
  dataAiHint?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface Appointment {
  id: string;
  patientName: string;
  treatmentName: string;
  date: Date;
  status: AppointmentStatus;
  paymentReference: string;
  paymentProofUrl?: string;
  paymentVerification?: VerifyPaymentProofOutput;
  createdAt: Date;
}
