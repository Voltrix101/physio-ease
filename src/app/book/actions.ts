
'use server';

import { z } from 'zod';
import { verifyPaymentProof } from '@/ai/flows/verify-payment-proof';
import type { VerifyPaymentProofOutput } from '@/ai/flows/verify-payment-proof';

// This file is intentionally left with only the AI-related server-side code.
// The Firestore 'createAppointment' logic has been moved to a client-side
// function in /lib/appointments.ts to ensure proper user authentication.

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

// The createAppointment function has been removed from this file.
