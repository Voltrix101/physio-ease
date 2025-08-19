export type TChatRequest = {
  message: string;
  context?: { lastCategory?: string | null };
};

export type TCTA = { label: string; url: string };

export type TChatResponse = {
  bot: string;
  suggestions?: string[];
  commandsHint?: string[];
  recommendations?: Array<{ name: string; id: string }>;
  cta?: TCTA;
  context?: { lastCategory?: string | null };
};

export type TCommand =
  | { kind: "start" }
  | { kind: "help" }
  | { kind: "recommend" }
  | { kind: "book"; payload: string }
  | { kind: "symptom"; payload: string };
