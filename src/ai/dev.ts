'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/verify-payment-proof.ts';
import '@/ai/flows/generate-image-flow';
import '@/ai/flows/suggest-treatment-flow';
