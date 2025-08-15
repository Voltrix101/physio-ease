'use server';

import { z } from 'zod';
import { verifyPaymentProof } from '@/ai/flows/verify-payment-proof';
import type { VerifyPaymentProofOutput } from '@/ai/flows/verify-payment-proof';

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

export async function createAppointment(prevState: State, formData: FormData) {
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

    const { paymentProof } = validatedFields.data;

    try {
        const verificationResult = await verifyPaymentProof({ paymentProof });
        
        // In a real application, you would save the appointment to Firestore here,
        // including the patient name, treatment, date, time, and the AI verification result.
        
        console.log('AI Verification:', verificationResult);

        return {
            message: 'Appointment requested successfully!',
            success: true,
            data: verificationResult,
        };
    } catch (error) {
        console.error('AI Verification Error:', error);
        return {
            message: 'Failed to verify payment proof. Please try again.',
            success: false,
        };
    }
}
