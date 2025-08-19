// Treatments data for chatbot - this integrates with your existing Treatment type
// but provides simplified data for chatbot recommendations

import type { Treatment } from './types';

type TSimpleTreatment = { name: string; id: string; primary?: boolean };

type TCatalog = {
  [category: string]: TSimpleTreatment[];
};

// Map to common treatment IDs that should align with your Firestore data
export const LOCAL: TCatalog = {
  back: [
    { name: "Manual Therapy", id: "manual-therapy", primary: true },
    { name: "Heat & Cold Therapy", id: "heat-cold-therapy" },
    { name: "Traction Therapy", id: "traction-therapy" },
    { name: "Exercise Therapy", id: "exercise-therapy" },
  ],
  neck: [
    { name: "Manual Therapy", id: "manual-therapy", primary: true },
    { name: "Traction Therapy", id: "traction-therapy" },
    { name: "Exercise Therapy", id: "exercise-therapy" },
    { name: "Electrotherapy", id: "electrotherapy" },
  ],
  knee: [
    { name: "Exercise Therapy", id: "exercise-therapy", primary: true },
    { name: "Ultrasound Therapy", id: "ultrasound-therapy" },
    { name: "Kinesio Taping", id: "kinesio-taping" },
    { name: "Manual Therapy", id: "manual-therapy" },
  ],
  shoulder: [
    { name: "Manual Therapy", id: "manual-therapy", primary: true },
    { name: "Exercise Therapy", id: "exercise-therapy" },
    { name: "Ultrasound Therapy", id: "ultrasound-therapy" },
    { name: "Kinesio Taping", id: "kinesio-taping" },
  ],
  posture: [
    { name: "Exercise Therapy", id: "exercise-therapy", primary: true },
    { name: "Manual Therapy", id: "manual-therapy" },
    { name: "Heat & Cold Therapy", id: "heat-cold-therapy" },
  ],
};

export async function getTreatments(): Promise<TCatalog> {
  // For now using local data - you can later integrate with Firestore
  // const snap = await getDocs(collection(db, "treatments"));
  // and build the catalog dynamically
  return LOCAL;
}
