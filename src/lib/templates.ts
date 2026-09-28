export type TemplateTone =
  | "gold"
  | "emerald"
  | "midnight"
  | "rose"
  | "sand"
  | "burgundy"
  | "sapphire"
  | "xiguiane";

export type TemplateDefinition = {
  value: string;
  label: string;
  family: string;
  tone: TemplateTone;
  description: string;
  implemented: boolean;
};

export const TEMPLATE_OPTIONS: TemplateDefinition[] = [
  { value: "golden-classic", label: "Noir & Ouro", family: "Clássico / Luxury", tone: "gold", description: "Elegância editorial em preto, creme e dourado.", implemented: true },
  { value: "aquarela-botanica", label: "Aguarela Botânica", family: "Floral / Garden", tone: "rose", description: "Aguarela romântica com elementos botânicos.", implemented: true },
  { value: "emerald-elegante", label: "Esmeralda Elegante", family: "Minimalista / Verde", tone: "emerald", description: "Verde profundo, marfim e detalhes dourados.", implemented: true },
  { value: "midnight-blue", label: "Midnight Blue", family: "Minimalista / Azul", tone: "midnight", description: "Azul-noite cinematográfico com champagne.", implemented: true },
  { value: "romantic-rose", label: "Romantic Rose", family: "Romântico", tone: "rose", description: "Rosa antigo, marfim e tipografia delicada.", implemented: true },
  { value: "boho-sand", label: "Boho Sand", family: "Boho / Natural", tone: "sand", description: "Areia, terracota suave e estética orgânica.", implemented: true },
  { value: "royal-burgundy", label: "Royal Burgundy", family: "Imperial / Royal", tone: "burgundy", description: "Bordô profundo, marfim e dourado antigo.", implemented: true },
  { value: "sapphire-editorial", label: "Sapphire Editorial", family: "Editorial / Luxury", tone: "sapphire", description: "Azul safira, branco quente e metal dourado.", implemented: true },
  { value: "xiguiane-tradicional", label: "Xiguiane Tradicional", family: "Tradicional Africano", tone: "xiguiane", description: "Uma base contemporânea para cerimónias tradicionais moçambicanas.", implemented: true },
];

export function getTemplateDefinition(value?: string | null) {
  return TEMPLATE_OPTIONS.find((template) => template.value === value) ?? TEMPLATE_OPTIONS[0];
}

export function templateToneClass(value?: string | null) {
  return "invite-tone-" + getTemplateDefinition(value).tone;
}
