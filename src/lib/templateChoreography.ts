export type TemplateFlow =
  | "classic"
  | "minimal"
  | "editorial"
  | "cinematic"
  | "romantic"
  | "garden"
  | "royal"
  | "heritage"
  | "boho"
  | "destination"
  | "celestial"
  | "magazine"
  | "pearl"
  | "capulana"
  | "cinema"
  | "portrait"
  | "olive"
  | "atelier"
  | "mozambique"
  | "sunset"
  | "paper"
  | "pearl-editorial";

const FLOW_BY_VALUE: Record<string, TemplateFlow> = {
  "golden-classic": "classic",
  "classic-ivory": "classic",
  "emerald-elegante": "minimal",
  "minimalist-brown": "minimal",
  "minimalist-burgundy": "minimal",
  "minimalist-lavender": "minimal",
  "minimalist-white": "minimal",
  "minimalist-black": "minimal",
  "midnight-blue": "cinematic",
  "sapphire-editorial": "editorial",
  "editorial-dark": "editorial",
  "cinematic-charcoal": "cinematic",
  "baroque-gold": "royal",
  "royal-emerald": "royal",
  "royal-burgundy": "royal",
  "royal-sapphire": "royal",
  "royal-black-gold": "royal",
  "romantic-rose": "romantic",
  "romantic-champagne": "romantic",
  "garden-green": "garden",
  "garden-blue": "garden",
  "garden-ivory": "garden",
  "boho-sand": "boho",
  "boho-rose": "boho",
  "vintage-cream": "classic",
  "european-ivory": "classic",
  "mediterranean-blue": "destination",
  "sicilian-terracotta": "destination",
  "oriental-red": "heritage",
  "oriental-green": "heritage",
  "oriental-blue": "heritage",
  "nikah-emerald": "royal",
  "traditional-bronze": "heritage",
  "tropical-green": "garden",
  "tropical-sunset": "destination",
  "floral-pearl": "romantic",
  "african-heritage": "heritage",
  "xiguiane-tradicional": "heritage",
  "film-noir-motion": "cinematic",
  "editorial-magazine": "magazine",
  "pearl-garden": "pearl",
  "capulana-contemporary": "capulana",
  "celestial-ivory": "celestial",
  "coastal-blue": "destination",
  "aquarela-botanica": "garden",
  "editorial-cinema": "cinema",
  "ivory-portrait": "portrait",
  "modern-olive": "olive",
  "rose-atelier": "atelier",
  "mozambique-luxe": "mozambique",
  "sunset-destination": "sunset",
  "black-paper": "paper",
  "pearl-editorial": "pearl-editorial",
};

const DEFAULT_ORDER = [
  "hero", "welcome", "word", "couple", "story", "schedule", "location", "rsvp",
  "gifts", "dress-code", "guestbook", "countdown", "gallery", "contacts", "closing",
];

export const TEMPLATE_SECTION_ORDERS: Record<TemplateFlow, string[]> = {
  classic: DEFAULT_ORDER,
  minimal: ["hero", "welcome", "couple", "story", "gallery", "countdown", "schedule", "location", "gifts", "rsvp", "guestbook", "word", "contacts", "closing"],
  editorial: ["hero", "welcome", "couple", "story", "gallery", "schedule", "location", "countdown", "gifts", "guestbook", "rsvp", "word", "contacts", "closing"],
  cinematic: ["hero", "countdown", "story-video", "story", "couple", "moments", "gallery", "schedule", "location", "rsvp", "gifts", "guestbook", "welcome", "word", "contacts", "closing"],
  romantic: ["hero", "welcome", "couple", "story", "gallery", "countdown", "schedule", "location", "gifts", "guestbook", "rsvp", "word", "contacts", "closing"],
  garden: ["hero", "welcome", "couple", "gallery", "story", "moments", "countdown", "schedule", "location", "gifts", "rsvp", "guestbook", "word", "contacts", "closing"],
  royal: ["hero", "word", "couple", "party", "schedule", "location", "story", "gallery", "countdown", "gifts", "guestbook", "rsvp", "welcome", "contacts", "closing"],
  heritage: ["hero", "word", "couple", "party", "story", "moments", "schedule", "location", "gallery", "countdown", "gifts", "guestbook", "rsvp", "welcome", "contacts", "closing"],
  boho: ["hero", "welcome", "story", "couple", "gallery", "location", "schedule", "dress-code", "countdown", "gifts", "guestbook", "rsvp", "word", "contacts", "closing"],
  destination: ["hero", "welcome", "location", "couple", "gallery", "story", "schedule", "dress-code", "countdown", "gifts", "rsvp", "guestbook", "word", "contacts", "closing"],
  celestial: ["hero", "word", "countdown", "couple", "story", "schedule", "gallery", "location", "gifts", "guestbook", "rsvp", "welcome", "contacts", "closing"],
  magazine: ["hero", "word", "couple", "story", "gallery", "schedule", "location", "countdown", "party", "gifts", "rsvp", "guestbook", "welcome", "contacts", "closing"],
  pearl: ["hero", "welcome", "couple", "story", "gallery", "countdown", "schedule", "location", "guestbook", "gifts", "rsvp", "word", "contacts", "closing"],
  capulana: ["hero", "word", "party", "couple", "story", "moments", "schedule", "location", "gallery", "dress-code", "countdown", "gifts", "rsvp", "guestbook", "welcome", "contacts", "closing"],
  cinema: ["hero", "word", "story-video", "story", "couple", "schedule", "location", "rsvp", "gifts", "dress-code", "guestbook", "countdown", "gallery", "closing", "contacts"],
  portrait: ["hero", "welcome", "couple", "word", "gallery", "story", "schedule", "location", "rsvp", "gifts", "guestbook", "countdown", "closing", "contacts"],
  olive: ["hero", "welcome", "story", "couple", "location", "schedule", "gallery", "dress-code", "rsvp", "gifts", "guestbook", "countdown", "closing", "contacts"],
  atelier: ["hero", "welcome", "word", "couple", "story", "gallery", "schedule", "location", "gifts", "rsvp", "guestbook", "countdown", "closing", "contacts"],
  mozambique: ["hero", "word", "party", "couple", "story", "moments", "schedule", "location", "dress-code", "rsvp", "gifts", "guestbook", "countdown", "gallery", "closing", "contacts"],
  sunset: ["hero", "welcome", "location", "couple", "schedule", "dress-code", "story", "gallery", "countdown", "rsvp", "gifts", "guestbook", "closing", "contacts"],
  paper: ["hero", "word", "couple", "story", "schedule", "location", "rsvp", "gallery", "gifts", "guestbook", "countdown", "closing", "contacts"],
  "pearl-editorial": ["hero", "welcome", "word", "couple", "gallery", "story", "countdown", "schedule", "location", "rsvp", "gifts", "guestbook", "closing", "contacts"],
};

export function getTemplateFlow(value?: string | null): TemplateFlow {
  return FLOW_BY_VALUE[value ?? ""] ?? "classic";
}

export function templateFlowClass(value?: string | null) {
  return `template-flow-${getTemplateFlow(value)}`;
}
