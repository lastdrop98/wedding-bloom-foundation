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
  { value: "classic-ivory", label: "Classic Ivory", family: "Clássico", tone: "sand", description: "Marfim, serifas refinadas e detalhes discretos.", implemented: true },
  { value: "emerald-elegante", label: "Esmeralda Elegante", family: "Minimalista / Verde", tone: "emerald", description: "Verde profundo, marfim e detalhes dourados.", implemented: true },
  { value: "minimalist-brown", label: "Minimalist Brown", family: "Minimalista / Neutro", tone: "sand", description: "Castanho quente, creme e composição limpa.", implemented: true },
  { value: "minimalist-burgundy", label: "Minimalist Burgundy", family: "Minimalista / Vermelho", tone: "burgundy", description: "Bordô, papel claro e tipografia de alto contraste.", implemented: true },
  { value: "minimalist-lavender", label: "Minimalist Lavender", family: "Minimalista / Lilás", tone: "rose", description: "Lavanda suave com composição editorial.", implemented: true },
  { value: "midnight-blue", label: "Midnight Blue", family: "Minimalista / Azul", tone: "midnight", description: "Azul-noite cinematográfico com champagne.", implemented: true },
  { value: "sapphire-editorial", label: "Sapphire Editorial", family: "Editorial / Luxury", tone: "sapphire", description: "Azul safira, branco quente e metal dourado.", implemented: true },
  { value: "baroque-gold", label: "Baroque Gold", family: "Barroco / Luxury", tone: "gold", description: "Ornamentação dourada com atmosfera palaciana.", implemented: true },
  { value: "royal-emerald", label: "Royal Emerald", family: "Royal / Imperial", tone: "emerald", description: "Verde joia e dourado para uma estética majestosa.", implemented: true },
  { value: "royal-burgundy", label: "Royal Burgundy", family: "Royal / Imperial", tone: "burgundy", description: "Bordô profundo, marfim e dourado antigo.", implemented: true },
  { value: "royal-sapphire", label: "Royal Sapphire", family: "Royal / Imperial", tone: "sapphire", description: "Safira escura, molduras finas e brilho dourado.", implemented: true },
  { value: "romantic-rose", label: "Romantic Rose", family: "Romântico", tone: "rose", description: "Rosa antigo, marfim e tipografia delicada.", implemented: true },
  { value: "garden-green", label: "Spring Garden Green", family: "Garden / Natureza", tone: "emerald", description: "Verde botânico com formas suaves inspiradas no jardim.", implemented: true },
  { value: "garden-blue", label: "Spring Garden Blue", family: "Garden / Natureza", tone: "sapphire", description: "Azul sereno e natureza com atmosfera fresca.", implemented: true },
  { value: "boho-sand", label: "Boho Sand", family: "Boho / Natural", tone: "sand", description: "Areia, terracota suave e estética orgânica.", implemented: true },
  { value: "boho-rose", label: "Boho Rose", family: "Boho / Floral", tone: "rose", description: "Aguarela rosada e formas orgânicas.", implemented: true },
  { value: "vintage-cream", label: "Vintage Cream", family: "Vintage / Heritage", tone: "sand", description: "Papel envelhecido, castanho e detalhes clássicos.", implemented: true },
  { value: "mediterranean-blue", label: "Mediterranean Blue", family: "Mediterrâneo", tone: "sapphire", description: "Azul costeiro e composição luminosa.", implemented: true },
  { value: "oriental-red", label: "Heritage Red", family: "Oriental / Tradicional", tone: "burgundy", description: "Vermelho profundo, dourado e geometria cerimonial.", implemented: true },
  { value: "oriental-green", label: "Heritage Green", family: "Oriental / Tradicional", tone: "emerald", description: "Verde profundo e ornamentos inspirados em herança clássica.", implemented: true },
  { value: "oriental-blue", label: "Heritage Blue", family: "Oriental / Tradicional", tone: "sapphire", description: "Azul clássico com molduras e detalhes de porcelana.", implemented: true },
  { value: "tropical-green", label: "Tropical Botanical", family: "Tropical", tone: "emerald", description: "Verde vivo e inspiração botânica tropical.", implemented: true },
  { value: "african-heritage", label: "African Heritage", family: "Tradicional Africano", tone: "xiguiane", description: "Base contemporânea para cerimónias e estética africana.", implemented: true },
  { value: "xiguiane-tradicional", label: "Xiguiane Tradicional", family: "Tradicional Africano", tone: "xiguiane", description: "Uma base contemporânea para cerimónias tradicionais moçambicanas.", implemented: true },
  { value: "editorial-dark", label: "Editorial Dark", family: "Editorial / Dark", tone: "midnight", description: "Preto, azul profundo e composição cinematográfica.", implemented: true },
  { value: "aquarela-botanica", label: "Aguarela Botânica", family: "Floral / Garden", tone: "rose", description: "Aguarela romântica com elementos botânicos.", implemented: true },
];

export function getTemplateDefinition(value?: string | null) {
  return TEMPLATE_OPTIONS.find((template) => template.value === value) ?? TEMPLATE_OPTIONS[0];
}

export function templateToneClass(value?: string | null) {
  return "invite-tone-" + getTemplateDefinition(value).tone;
}
