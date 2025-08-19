import { RULES } from "./rules";

export const normalize = (s: string) => s.toLowerCase().trim();

export function emergencyOutOfScope(text: string): boolean {
  const t = normalize(text);
  // flag out-of-scope / emergency symptoms
  const redFlags = [
    "chest pain", "shortness of breath", "faint", "fainting", "heart", "palpitation",
    "stroke", "bleeding", "fracture", "head injury", "severe burn", "unconscious",
    "dizzy", "dizziness", "nausea", "vomiting", "fever", "infection", "swelling severe",
    "numbness", "tingling", "weakness sudden", "vision", "speech", "confusion"
  ];
  return redFlags.some(w => t.includes(w));
}

export function inferCategory(text: string): string | null {
  const t = normalize(text);
  for (const rule of RULES) {
    if (rule.keywords.some(k => t.includes(k))) return rule.category;
  }
  return null;
}

export function bestPrimaryTreatment(category: string, treatments: any[]) {
  if (!treatments?.length) return null;
  // prefer one marked primary, else first
  const primary = treatments.find(t => t.primary) || treatments[0];
  return primary;
}
