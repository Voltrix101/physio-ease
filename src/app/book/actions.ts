
'use server';

import { z } from 'zod';
import { verifyPaymentProof } from '@/ai/flows/verify-payment-proof';
import type { VerifyPaymentProofOutput } from '@/ai/flows/verify-payment-proof';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import type { Treatment } from '@/lib/types';
import { auth } from '@/lib/firebase';


const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    treatmentId: z.string({ required_error: 'Please select a treatment.' }),
    date: z.string({ required_error: 'Please select a date.' }),
    time: z.string({ required_error: 'Please select a time.' }),
    paymentProof: z.string().min(1, 'Payment proof is required.'),
});

export type State = {
    errors?: {
        name?: string[];
        treatmentId?: string[];
        date?: string[];
        time?: string[];
        paymentProof?: string[];
    };
    message?: string | null;
    success: boolean;
    data?: VerifyPaymentProofOutput;
};

export async function createAppointment(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = FormSchema.safeParse({
        name: formData.get('name'),
        treatmentId: formData.get('treatmentId'),
        date: formData.get('date'),
        time: formData.get('time'),
        paymentProof: formData.get('paymentProof'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Appointment.',
            success: false,
        };
    }
    
    // Check for authenticated user
    if (!auth.currentUser) {
        return {
            message: 'You must be logged in to book an appointment.',
            success: false
        };
    }

    const { name, treatmentId, date, time, paymentProof } = validatedFields.data;

    try {
        const verificationResult = await verifyPaymentProof({ paymentProof });
        
        const treatmentRef = doc(db, 'treatments', treatmentId);
        const treatmentSnap = await getDoc(treatmentRef);

        if (!treatmentSnap.exists()) {
             return {
                message: `Failed to create appointment: Selected treatment does not exist.`,
                success: false,
            };
        }
        
        const selectedTreatment = treatmentSnap.data() as Treatment;
        
        await addDoc(collection(db, 'appointments'), {
            patientName: name,
            patientId: auth.currentUser.uid, // Add user's UID
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
            message: 'Appointment requested successfully!',
            success: true,
            data: verificationResult,
        };
    } catch (error) {
        console.error('Error creating appointment:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return {
            message: `Failed to create appointment: ${errorMessage}`,
            success: false,
        };
    }
}
