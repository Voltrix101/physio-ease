
'use client';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import type { Treatment } from '@/lib/types';
import { verifyPaymentProof } from '@/ai/flows/verify-payment-proof';
import type { VerifyPaymentProofOutput } from '@/ai/flows/verify-payment-proof';

export interface AppointmentData {
  name: string;
  treatmentId: string;
  date: string;
  time: string;
  paymentProof: string;
  userId: string;
}

export interface CreateAppointmentResult {
  success: boolean;
  message: string;
  data?: VerifyPaymentProofOutput;
}

export async function createAppointment(data: AppointmentData): Promise<CreateAppointmentResult> {
  try {
    const { name, treatmentId, date, time, paymentProof, userId } = data;
    
    if (!userId) {
      return { success: false, message: 'User is not logged in.' };
    }
    
    // Verify payment proof using AI
    const verificationResult = await verifyPaymentProof({ paymentProof });
    
    // Get treatment details
    const treatmentRef = doc(db, 'treatments', treatmentId);
    const treatmentSnap = await getDoc(treatmentRef);

    if (!treatmentSnap.exists()) {
      return {
        success: false,
        message: 'Selected treatment does not exist.',
      };
    }
    
    const selectedTreatment = treatmentSnap.data() as Treatment;
    
    // Create appointment document
    await addDoc(collection(db, 'appointments'), {
      patientName: name,
      patientId: userId, // This is the crucial field for the security rule
      treatmentId: treatmentId,
      treatmentName: selectedTreatment?.name || 'Unknown Treatment',
      date: new Date(date),
      time: time,
      paymentProof: paymentProof,
      paymentVerification: verificationResult,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Appointment requested successfully!',
      data: verificationResult,
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `Failed to create appointment: ${errorMessage}`,
    };
  }
}
