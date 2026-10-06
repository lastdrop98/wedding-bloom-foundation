export type TemplateTone =
  "gold" | "emerald" | "midnight" | "rose" | "sand" | "burgundy" | "sapphire" | "xiguiane";

export type TemplateDefinition = {
  value: string;
  label: string;
  family: string;
  tone: TemplateTone;
  description: string;
  implemented: boolean;
};

export const TEMPLATE_OPTIONS: TemplateDefinition[] = [
  {
    value: "golden-classic",
    label: "Noir & Ouro",
    family: "Clássico / Luxury",
    tone: "gold",
    description: "Elegância editorial em preto, creme e dourado.",
    implemented: true,
  },
  {
    value: "classic-ivory",
    label: "Classic Ivory",
    family: "Clássico",
    tone: "sand",
    description: "Marfim, serifas refinadas e detalhes discretos.",
    implemented: true,
  },
  {
    value: "emerald-elegante",
    label: "Esmeralda Elegante",
    family: "Minimalista / Verde",
    tone: "emerald",
    description: "Verde profundo, marfim e detalhes dourados.",
    implemented: true,
  },
  {
    value: "minimalist-brown",
    label: "Minimalist Brown",
    family: "Minimalista / Neutro",
    tone: "sand",
    description: "Castanho quente, creme e composição limpa.",
    implemented: true,
  },
  {
    value: "minimalist-burgundy",
    label: "Minimalist Burgundy",
    family: "Minimalista / Vermelho",
    tone: "burgundy",
    description: "Bordô, papel claro e tipografia de alto contraste.",
    implemented: true,
  },
  {
    value: "minimalist-lavender",
    label: "Minimalist Lavender",
    family: "Minimalista / Lilás",
    tone: "rose",
    description: "Lavanda suave com composição editorial.",
    implemented: true,
  },
  {
    value: "minimalist-white",
    label: "Minimalist White",
    family: "Minimalista / Claro",
    tone: "sand",
    description: "Branco, marfim e espaço negativo para uma estética editorial.",
    implemented: true,
  },
  {
    value: "minimalist-black",
    label: "Minimalist Black",
    family: "Minimalista / Escuro",
    tone: "midnight",
    description: "Preto suave, tipografia grande e composição silenciosa.",
    implemented: true,
  },
  {
    value: "midnight-blue",
    label: "Midnight Blue",
    family: "Minimalista / Azul",
    tone: "midnight",
    description: "Azul-noite cinematográfico com champagne.",
    implemented: true,
  },
  {
    value: "sapphire-editorial",
    label: "Sapphire Editorial",
    family: "Editorial / Luxury",
    tone: "sapphire",
    description: "Azul safira, branco quente e metal dourado.",
    implemented: true,
  },
  {
    value: "editorial-dark",
    label: "Editorial Dark",
    family: "Editorial / Dark",
    tone: "midnight",
    description: "Preto, azul profundo e composição cinematográfica.",
    implemented: true,
  },
  {
    value: "cinematic-charcoal",
    label: "Cinematic Charcoal",
    family: "Cinemático",
    tone: "midnight",
    description: "Carvão, fotografia dramática e tipografia de grande escala.",
    implemented: true,
  },
  {
    value: "baroque-gold",
    label: "Baroque Gold",
    family: "Barroco / Luxury",
    tone: "gold",
    description: "Ornamentação dourada com atmosfera palaciana.",
    implemented: true,
  },
  {
    value: "royal-emerald",
    label: "Royal Emerald",
    family: "Royal / Imperial",
    tone: "emerald",
    description: "Verde joia e dourado para uma estética majestosa.",
    implemented: true,
  },
  {
    value: "royal-burgundy",
    label: "Royal Burgundy",
    family: "Royal / Imperial",
    tone: "burgundy",
    description: "Bordô profundo, marfim e dourado antigo.",
    implemented: true,
  },
  {
    value: "royal-sapphire",
    label: "Royal Sapphire",
    family: "Royal / Imperial",
    tone: "sapphire",
    description: "Safira escura, molduras finas e brilho dourado.",
    implemented: true,
  },
  {
    value: "royal-black-gold",
    label: "Royal Black & Gold",
    family: "Royal / Imperial",
    tone: "gold",
    description: "Preto profundo, moldura dupla e dourado de luxo.",
    implemented: true,
  },
  {
    value: "romantic-rose",
    label: "Romantic Rose",
    family: "Romântico",
    tone: "rose",
    description: "Rosa antigo, marfim e tipografia delicada.",
    implemented: true,
  },
  {
    value: "romantic-champagne",
    label: "Romantic Champagne",
    family: "Romântico / Luxury",
    tone: "sand",
    description: "Champagne, blush discreto e atmosfera de gala.",
    implemented: true,
  },
  {
    value: "garden-green",
    label: "Spring Garden Green",
    family: "Garden / Natureza",
    tone: "emerald",
    description: "Verde botânico com formas suaves inspiradas no jardim.",
    implemented: true,
  },
  {
    value: "garden-blue",
    label: "Spring Garden Blue",
    family: "Garden / Natureza",
    tone: "sapphire",
    description: "Azul sereno e natureza com atmosfera fresca.",
    implemented: true,
  },
  {
    value: "garden-ivory",
    label: "Garden Ivory",
    family: "Garden / Natureza",
    tone: "sand",
    description: "Marfim, folhagem suave e composição luminosa.",
    implemented: true,
  },
  {
    value: "boho-sand",
    label: "Boho Sand",
    family: "Boho / Natural",
    tone: "sand",
    description: "Areia, terracota suave e estética orgânica.",
    implemented: true,
  },
  {
    value: "boho-rose",
    label: "Boho Rose",
    family: "Boho / Floral",
    tone: "rose",
    description: "Aguarela rosada e formas orgânicas.",
    implemented: true,
  },
  {
    value: "vintage-cream",
    label: "Vintage Cream",
    family: "Vintage / Heritage",
    tone: "sand",
    description: "Papel envelhecido, castanho e detalhes clássicos.",
    implemented: true,
  },
  {
    value: "european-ivory",
    label: "European Ivory",
    family: "Europeu / Clássico",
    tone: "sand",
    description: "Marfim, linhas finas e elegância europeia.",
    implemented: true,
  },
  {
    value: "mediterranean-blue",
    label: "Mediterranean Blue",
    family: "Mediterrâneo",
    tone: "sapphire",
    description: "Azul costeiro e composição luminosa.",
    implemented: true,
  },
  {
    value: "sicilian-terracotta",
    label: "Sicilian Terracotta",
    family: "Mediterrâneo / Siciliano",
    tone: "sand",
    description: "Terracota, creme e inspiração mediterrânica.",
    implemented: true,
  },
  {
    value: "oriental-red",
    label: "Heritage Red",
    family: "Oriental / Tradicional",
    tone: "burgundy",
    description: "Vermelho profundo, dourado e geometria cerimonial.",
    implemented: true,
  },
  {
    value: "oriental-green",
    label: "Heritage Green",
    family: "Oriental / Tradicional",
    tone: "emerald",
    description: "Verde profundo e ornamentos inspirados em herança clássica.",
    implemented: true,
  },
  {
    value: "oriental-blue",
    label: "Heritage Blue",
    family: "Oriental / Tradicional",
    tone: "sapphire",
    description: "Azul clássico com molduras e detalhes de porcelana.",
    implemented: true,
  },
  {
    value: "nikah-emerald",
    label: "Nikah Emerald",
    family: "Nikah / Cerimonial",
    tone: "emerald",
    description: "Verde joia, marfim e ornamentação cerimonial.",
    implemented: true,
  },
  {
    value: "traditional-bronze",
    label: "Traditional Bronze",
    family: "Tradicional",
    tone: "gold",
    description: "Bronze, castanho e molduras inspiradas em convite físico.",
    implemented: true,
  },
  {
    value: "tropical-green",
    label: "Tropical Botanical",
    family: "Tropical",
    tone: "emerald",
    description: "Verde vivo e inspiração botânica tropical.",
    implemented: true,
  },
  {
    value: "tropical-sunset",
    label: "Tropical Sunset",
    family: "Tropical / Sunset",
    tone: "rose",
    description: "Rosa queimado, areia e uma atmosfera tropical ao entardecer.",
    implemented: true,
  },
  {
    value: "floral-pearl",
    label: "Floral Pearl",
    family: "Floral",
    tone: "rose",
    description: "Pérola, blush e composição floral delicada.",
    implemented: true,
  },
  {
    value: "african-heritage",
    label: "African Heritage",
    family: "Tradicional Africano",
    tone: "xiguiane",
    description: "Base contemporânea para cerimónias e estética africana.",
    implemented: true,
  },
  {
    value: "xiguiane-tradicional",
    label: "Xiguiane Tradicional",
    family: "Tradicional Africano",
    tone: "xiguiane",
    description: "Uma base contemporânea para cerimónias tradicionais moçambicanas.",
    implemented: true,
  },
  {
    value: "film-noir-motion",
    label: "Film Noir Motion",
    family: "Cinemático / Vídeo",
    tone: "midnight",
    description: "Convite cinematográfico pensado para capa em vídeo e fotografia dramática.",
    implemented: true,
  },
  {
    value: "editorial-magazine",
    label: "Editorial Magazine",
    family: "Editorial / Fashion",
    tone: "sand",
    description: "Composição de revista, tipografia de grande escala e cortes fotográficos.",
    implemented: true,
  },
  {
    value: "pearl-garden",
    label: "Pearl Garden",
    family: "Garden / Luxury",
    tone: "rose",
    description: "Jardim romântico com pérola, flores delicadas e composição assimétrica.",
    implemented: true,
  },
  {
    value: "capulana-contemporary",
    label: "Capulana Contemporary",
    family: "Tradicional Africano / Moderno",
    tone: "xiguiane",
    description: "Herança moçambicana reinterpretada com grafismos têxteis e luxo contemporâneo.",
    implemented: true,
  },
  {
    value: "celestial-ivory",
    label: "Celestial Ivory",
    family: "Luxury / Celestial",
    tone: "gold",
    description: "Marfim, dourado e constelações para uma experiência celestial.",
    implemented: true,
  },
  {
    value: "coastal-blue",
    label: "Coastal Blue",
    family: "Destination / Coastal",
    tone: "sapphire",
    description: "Azul costeiro, fotografia ampla e ritmo de destination wedding.",
    implemented: true,
  },
  {
    value: "aquarela-botanica",
    label: "Aguarela Botânica",
    family: "Floral / Garden",
    tone: "rose",
    description: "Aguarela romântica com elementos botânicos.",
    implemented: true,
  },
];

export function getTemplateDefinition(value?: string | null) {
  return TEMPLATE_OPTIONS.find((template) => template.value === value) ?? TEMPLATE_OPTIONS[0]!;
}

export type TemplateLayout =
  | "editorial"
  | "organic"
  | "framed"
  | "heritage"
  | "cinematic"
  | "classic";

export function getTemplateLayout(value?: string | null): TemplateLayout {
  const template = getTemplateDefinition(value);
  const source = `${template.value} ${template.label} ${template.family}`;

  if (/xiguiane|african/i.test(source)) return "heritage";
  if (/minimalist|editorial|cinematic|sapphire-editorial/i.test(source)) return "editorial";
  if (/garden|botanical|floral|romantic|boho|tropical|mediterranean/i.test(source)) return "organic";
  if (/royal|baroque|oriental|nikah|traditional-bronze/i.test(source)) return "framed";
  if (/midnight|charcoal/i.test(source)) return "cinematic";
  return "classic";
}

export type TemplateVisualFamily =
  | "classic"
  | "editorial"
  | "cinematic"
  | "botanical"
  | "pearl"
  | "royal"
  | "heritage"
  | "celestial"
  | "coastal";

export function getTemplateVisualFamily(value?: string | null): TemplateVisualFamily {
  const template = getTemplateDefinition(value);
  const source = `${template.value} ${template.label} ${template.family}`.toLowerCase();

  if (/film-noir|cinematic-charcoal|editorial-dark|midnight-blue/.test(source)) return "cinematic";
  if (/editorial|minimalist|sapphire-editorial/.test(source)) return "editorial";
  if (/aquarela|garden|botanical|floral|romantic|boho|tropical/.test(source)) {
    if (/pearl|floral-pearl|pearl-garden/.test(source)) return "pearl";
    return "botanical";
  }
  if (/royal|baroque|oriental|nikah|traditional-bronze/.test(source)) return "royal";
  if (/xiguiane|african|capulana/.test(source)) return "heritage";
  if (/celestial/.test(source)) return "celestial";
  if (/coastal|destination|mediterranean|sicilian/.test(source)) return "coastal";
  return "classic";
}

export function templateVisualClass(value?: string | null) {
  return `template-visual-${getTemplateVisualFamily(value)}`;
}

export function templateToneClass(value?: string | null) {
  return `invite-tone-${getTemplateDefinition(value).tone} template-layout-${getTemplateLayout(value)}`;
}
