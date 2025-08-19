
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { verifyPaymentProof } from '@/ai/flows/verify-payment-proof';
import type { VerifyPaymentProofOutput } from '@/ai/flows/verify-payment-proof';
import type { Treatment } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export type State = {
    errors?: {
        name?: string[];
        treatmentId?: string[];
        date?: string[];
        time?: string[];
        paymentProof?: string[];
        userId?: string[];
    };
    message?: string | null;
    success: boolean;
    data?: VerifyPaymentProofOutput;
};

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  treatmentId: z.string({ required_error: 'Please select a service.' }),
  date: z.date({ required_error: 'Please select a date.' }),
  time: z.string({ required_error: 'Please select a time.' }),
  paymentProof: z.string().min(1, { message: 'Payment proof is required.' }),
  userId: z.string({ required_error: 'You must be logged in to book.' }),
});

export async function createAppointment(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    treatmentId: formData.get('treatmentId'),
    date: new Date(formData.get('date') as string),
    time: formData.get('time'),
    paymentProof: formData.get('paymentProof'),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to create appointment.',
      success: false,
    };
  }

  const { name, treatmentId, date, time, paymentProof, userId } = validatedFields.data;

  try {
    // 1. Verify payment proof using AI
    const verificationResult = await verifyPaymentProof({ paymentProof });

    // 2. Get treatment details
    const treatmentRef = doc(db, 'treatments', treatmentId);
    const treatmentSnap = await getDoc(treatmentRef);

    if (!treatmentSnap.exists()) {
      return { message: 'Selected treatment does not exist.', success: false };
    }
    const selectedTreatment = treatmentSnap.data() as Treatment;

    // 3. Create appointment document
    await addDoc(collection(db, 'appointments'), {
      patientName: name,
      patientId: userId,
      treatmentId: treatmentId,
      treatmentName: selectedTreatment.name,
      date: date,
      time: time,
      paymentProof: paymentProof, // This is now the data URI or transaction ID
      paymentVerification: verificationResult,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    revalidatePath('/book');
    return { success: true, message: 'Appointment requested successfully!' };

  } catch (error) {
    console.error('Error creating appointment:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { message: `Failed to create appointment: ${errorMessage}`, success: false };
  }
}
