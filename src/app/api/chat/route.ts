import { NextResponse } from "next/server";
import { inferCategory, emergencyOutOfScope, normalize, bestPrimaryTreatment } from "../../../lib/chatbot/triage";
import { RULES } from "@/lib/chatbot/rules";
import { TChatRequest, TChatResponse, TCommand } from "@/lib/chatbot/types";

// Local treatments catalog for chatbot recommendations
const TREATMENTS_CATALOG = {
  back: [
    { name: "Manual Therapy", id: "manual-therapy", primary: true },
    { name: "Heat & Cold Therapy", id: "heat-cold-therapy" },
    { name: "Traction Therapy", id: "traction-therapy" },
    { name: "Exercise Therapy", id: "exercise-therapy" },
  ],
  neck: [
    { name: "Manual Therapy", id: "manual-therapy", primary: true },
    { name: "Heat & Cold Therapy", id: "heat-cold-therapy" },
    { name: "Exercise Therapy", id: "exercise-therapy" },
  ],
  knee: [
    { name: "Exercise Therapy", id: "exercise-therapy", primary: true },
    { name: "Ultrasound Therapy", id: "ultrasound-therapy" },
    { name: "Manual Therapy", id: "manual-therapy" },
  ],
  shoulder: [
    { name: "Manual Therapy", id: "manual-therapy", primary: true },
    { name: "Exercise Therapy", id: "exercise-therapy" },
    { name: "Ultrasound Therapy", id: "ultrasound-therapy" },
  ],
  posture: [
    { name: "Exercise Therapy", id: "exercise-therapy", primary: true },
    { name: "Manual Therapy", id: "manual-therapy" },
  ],
};

// Helper functions for chatbot logic
function createSafetyResponse(message: string): TChatResponse {
  return {
    bot: message,
    cta: { label: "Find Emergency Care", url: "tel:911" },
    context: { lastCategory: "emergency" }
  };
}

function categorizeSymptom(text: string): string {
  return inferCategory(text) || "general";
}

function getTreatmentRecommendations(category: string) {
  return TREATMENTS_CATALOG[category as keyof typeof TREATMENTS_CATALOG] || [];
}

function generateFollowUpQuestions(category: string): string {
  const followUps: { [key: string]: string } = {
    back: "How long have you been experiencing this pain? Is it worse when sitting or standing?",
    neck: "Do you have any tingling or numbness in your arms? Is the pain worse when turning your head?",
    knee: "Does the pain occur when walking up/down stairs? Is there any swelling?",
    shoulder: "Can you lift your arm above your head? Is the pain worse at night?",
    posture: "How many hours per day do you spend at a desk? Do you experience headaches as well?",
    general: "Can you describe when the pain is worst? Any activities that make it better or worse?"
  };
  return followUps[category] || followUps.general;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TChatRequest;

    const message = normalize(body.message || "");

    // 1) greeting / small talk
    if (!message || /^hi|hello|hey|namaste$/i.test(message)) {
      const res: TChatResponse = {
        bot: "👋 Hi, I'm your Physiotherapy Assistant. Describe your problem in a few words or use the quick buttons below.",
        suggestions: ["Start Consultation", "Back Pain", "Neck Pain", "Knee Pain", "Shoulder Pain", "Posture Issue"],
        commandsHint: ["start", "recommend", "book <treatment>", "help"],
      };
      return NextResponse.json(res);
    }

    // 2) command handling
    const command = parseCommand(message);
    if (command) {
      const handled = await handleCommand(command, body.context?.lastCategory);
      return NextResponse.json(handled);
    }

    // 3) safety / scope checks
    const danger = emergencyOutOfScope(message);
    if (danger) {
      return NextResponse.json({
        bot:
          "⚠️ I can only provide guidance on physiotherapy-related conditions. Your symptom may need urgent medical attention. Please consult a doctor immediately.",
        suggestions: ["Back Pain", "Neck Pain", "Knee Pain", "Shoulder Pain", "Posture Issue"],
      } as TChatResponse);
    }

    // 4) infer category from symptoms
    const category = inferCategory(message);

    if (!category) {
      return NextResponse.json({
        bot:
          "I couldn't confidently match your symptom to a physiotherapy category. Try a few more details (e.g., 'sharp pain in right knee while walking').",
        suggestions: ["Back Pain", "Neck Pain", "Knee Pain", "Shoulder Pain", "Posture Issue"],
        commandsHint: ["start", "help"],
      } as TChatResponse);
    }

    // 5) map to treatments from catalog
    const recs = TREATMENTS_CATALOG[category as keyof typeof TREATMENTS_CATALOG] || [];
    const primary = bestPrimaryTreatment(category, recs);

    const response: TChatResponse = {
      bot:
        `🩺 I see this matches **${categoryLabel(category)}**.\n` +
        `👉 Common physiotherapy options:\n` +
        recs.slice(0, 3).map((t: {name: string; id: string}) => `• ${t.name}`).join("\n"),
      recommendations: recs.slice(0, 5),
      cta: primary
        ? { label: `Book ${primary.name}`, url: `/book?treatment=${encodeURIComponent(primary.id)}` }
        : undefined,
      context: { lastCategory: category },
      suggestions: ["recommend", `book ${primary?.name || "selected treatment"}`, "help"],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      bot: "I'm sorry, I'm experiencing technical difficulties. Please try again.",
      suggestions: ["Start Consultation", "Back Pain", "Neck Pain", "Knee Pain", "Shoulder Pain"],
    } as TChatResponse);
  }
}

// --- helpers ---
function parseCommand(text: string): TCommand | null {
  if (/^start$/.test(text)) return { kind: "start" };
  if (/^help$/.test(text)) return { kind: "help" };
  if (/^recommend$/.test(text)) return { kind: "recommend" };
  const bookMatch = text.match(/^book\s+(.+)/i);
  if (bookMatch) return { kind: "book", payload: bookMatch[1].trim() };
  const symptomMatch = text.match(/^symptom:\s*(.+)$/i);
  if (symptomMatch) return { kind: "symptom", payload: symptomMatch[1].trim() };
  return null;
}

async function handleCommand(cmd: TCommand, lastCategory?: string | null) {
  switch (cmd.kind) {
    case "start":
      return {
        bot: "Great, let's begin. Briefly describe your pain (e.g., 'stiff neck', 'pain in lower back while bending').",
        suggestions: ["Back Pain", "Neck Pain", "Knee Pain", "Shoulder Pain", "Posture Issue"],
        commandsHint: ["symptom: <text>", "recommend", "book <treatment>", "help"],
      } as TChatResponse;

    case "help":
      return {
        bot:
          "You can type symptoms in your own words, or use commands:\n" +
          "• start – begin consultation\n" +
          "• symptom: <text> – analyze your symptom\n" +
          "• recommend – suggest treatments for your last symptom\n" +
          "• book <treatment> – open booking with that treatment",
      } as TChatResponse;

    case "symptom":
      // Process symptom directly without recursive call
      const category = categorizeSymptom(cmd.payload);
      if (category === 'emergency') {
        return createSafetyResponse("Emergency symptoms detected. Please seek immediate medical attention. Call emergency services or visit the nearest hospital.");
      }
      
      const treatments = getTreatmentRecommendations(category);
      const followUp = generateFollowUpQuestions(category);
      
      return {
        bot: `Based on your symptoms, this appears to be related to ${category}. ${followUp}`,
        recommendations: treatments.slice(0, 3),
        context: { lastCategory: category }
      };

    case "recommend": {
      if (!lastCategory) {
        return { 
          bot: "Tell me your symptom first (e.g., 'knee pain while walking'), then I'll recommend treatments." 
        } as TChatResponse;
      }
      const recs = TREATMENTS_CATALOG[lastCategory as keyof typeof TREATMENTS_CATALOG] || [];
      const primary = bestPrimaryTreatment(lastCategory, recs);
      return {
        bot:
          `Based on your last symptom (${categoryLabel(lastCategory)}), I recommend starting with **${primary?.name}**.`,
        recommendations: recs.slice(0, 5),
        cta: primary ? { 
          label: `Book ${primary.name}`, 
          url: `/book?treatment=${encodeURIComponent(primary.id)}` 
        } : undefined,
        context: { lastCategory }
      } as TChatResponse;
    }

    case "book": {
      const term = normalize(cmd.payload);
      // try to match by name across catalog
      let found: { name: string; id: string } | null = null;
      for (const key of Object.keys(TREATMENTS_CATALOG)) {
        for (const t of TREATMENTS_CATALOG[key as keyof typeof TREATMENTS_CATALOG]) {
          if (normalize(t.name) === term || normalize(t.name).includes(term) || term.includes(normalize(t.name))) {
            found = { name: t.name, id: t.id };
            break;
          }
        }
        if (found) break;
      }
      if (!found) {
        return {
          bot:
            "I couldn't find that exact treatment. Try `book Manual Therapy` or use `recommend` to see options.",
        } as TChatResponse;
      }
      return {
        bot: `Booking **${found.name}**…`,
        cta: { 
          label: `Book ${found.name}`, 
          url: `/book?treatment=${encodeURIComponent(found.id)}` 
        },
      } as TChatResponse;
    }
  }
}

function categoryLabel(cat: string) {
  switch (cat) {
    case "back": return "Lower/Upper Back Pain";
    case "neck": return "Neck Pain / Stiffness";
    case "knee": return "Knee Pain";
    case "shoulder": return "Shoulder Pain";
    case "posture": return "Postural Strain";
    default: return cat;
  }
}
