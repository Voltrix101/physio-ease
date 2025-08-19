
'use server';

import type { VerifyPaymentProofOutput } from "@/ai/flows/verify-payment-proof";
import type { Timestamp } from "firebase/firestore";

export interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number; // in INR
  duration: number; // in minutes
  imageUrl: string;
  dataAiHint?: string;
}

export interface Product {
  id: string;
  name:string;
  price: number; // in INR
  imageUrl: string;
  affiliateUrl: string;
  dataAiHint?: string;
}

export interface Video {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    category?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string; // ID of the authenticated user
  treatmentId: string;
  treatmentName: string;
  date: Date | Timestamp; // Allow both for client-side and Firestore
  time: string;
  status: AppointmentStatus;
  paymentProof: string;
  paymentVerification?: VerifyPaymentProofOutput;
  createdAt: Timestamp;
}
