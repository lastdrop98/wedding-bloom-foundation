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
    value: "ceremony-editorial",
    label: "Ceremony Editorial",
    family: "Cerimonial / Editorial",
    tone: "sand",
    description: "Convite de cerimónia com abertura tipográfica, famílias, programa e RSVP.",
    implemented: true,
  },
  {
    value: "portrait-ceremony",
    label: "Portrait Ceremony",
    family: "Fotográfico / Cerimonial",
    tone: "sand",
    description: "Retrato protagonista, mensagem de abertura, cerimónia, agenda e livro de recados.",
    implemented: true,
  },
  {
    value: "garden-letter",
    label: "Garden Letter",
    family: "Botânico / Carta",
    tone: "rose",
    description: "Uma experiência botânica construída como carta, memória e celebração.",
    implemented: true,
  },
  {
    value: "cinema-love-story",
    label: "Cinema Love Story",
    family: "Cinemático / História",
    tone: "midnight",
    description: "Abertura cinematográfica, capítulos da história, galeria, agenda e final de filme.",
    implemented: true,
  },
  {
    value: "heritage-ceremony",
    label: "Heritage Ceremony",
    family: "Herança / Cerimonial",
    tone: "xiguiane",
    description: "Família, bênção, ritual, programa e fotografia numa linguagem contemporânea.",
    implemented: true,
  },
  {
    value: "pearl-ceremony",
    label: "Pearl Ceremony",
    family: "Pérola / Editorial",
    tone: "rose",
    description: "Convite luminoso com molduras suaves, mensagem, casal, agenda e RSVP.",
    implemented: true,
  },
  {
    value: "porcelain-botanical",
    label: "Porcelain Botanical",
    family: "Floral / Paper",
    tone: "rose",
    description: "Padrão floral de papel, cartões de conteúdo e calendário editorial.",
    implemented: true,
  },
  {
    value: "glass-garden",
    label: "Glass Garden",
    family: "Garden / Glass",
    tone: "emerald",
    description: "Jardim luminoso com molduras de vidro, fotografia e cartões translúcidos.",
    implemented: true,
  },
  {
    value: "silk-ribbon",
    label: "Silk Ribbon",
    family: "Floral / Luxury",
    tone: "rose",
    description: "Laços de seda, retratos emoldurados e ritmo de convite de papelaria.",
    implemented: true,
  },
  {
    value: "dried-flower",
    label: "Dried Flower",
    family: "Natural / Editorial",
    tone: "sand",
    description: "Flores secas, papel quente e composição de memória natural.",
    implemented: true,
  },
  {
    value: "elegant-leaf",
    label: "Elegant Leaf",
    family: "Botânico / Moderno",
    tone: "emerald",
    description: "Folhagem elegante, fotografia recortada e cartões editoriais limpos.",
    implemented: true,
  },
  {
    value: "chateau-coastal",
    label: "Chateau Coastal",
    family: "Destination / European",
    tone: "sapphire",
    description: "Abertura panorâmica, moldura clássica e ritmo de casamento de destino.",
    implemented: true,
  },
  {
    value: "lotus-atelier",
    label: "Lotus Atelier",
    family: "Floral / Atelier",
    tone: "rose",
    description: "Lótus, molduras finas e fotografia de retrato com acabamento de atelier.",
    implemented: true,
  },
  {
    value: "royal-forest",
    label: "Royal Forest",
    family: "Royal / Botanical",
    tone: "emerald",
    description: "Floresta profunda, molduras douradas e cartões cerimoniais.",
    implemented: true,
  },
  {
    value: "double-happiness",
    label: "Double Happiness",
    family: "Cerimonial / Heritage",
    tone: "burgundy",
    description: "Abertura cerimonial, selo de união, famílias e programa em cartões.",
    implemented: true,
  },
  {
    value: "crystal-floral",
    label: "Crystal Floral",
    family: "Floral / Crystal",
    tone: "sapphire",
    description: "Flores cristalinas, molduras translúcidas e composição editorial azul.",
    implemented: true,
  },
  {
    value: "ribbon-ivory",
    label: "Ribbon Ivory",
    family: "Minimalista / Luxury",
    tone: "sand",
    description: "Marfim, fita editorial e cartões de informação com acabamento premium.",
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
  {
    value: "editorial-cinema",
    label: "Editorial Cinema",
    family: "Cinemático / Editorial",
    tone: "midnight",
    description: "Narrativa de filme com fotografia protagonista, capítulos e final cinematográfico.",
    implemented: true,
  },
  {
    value: "ivory-portrait",
    label: "Ivory Portrait",
    family: "Minimalista / Fotográfico",
    tone: "sand",
    description: "Convite marfim centrado no retrato, com leitura limpa e elegante.",
    implemented: true,
  },
  {
    value: "modern-olive",
    label: "Modern Olive",
    family: "Minimalista / Natural",
    tone: "emerald",
    description: "Verde oliva, tipografia editorial e blocos assimétricos de inspiração mediterrânica.",
    implemented: true,
  },
  {
    value: "rose-atelier",
    label: "Rose Atelier",
    family: "Romântico / Editorial",
    tone: "rose",
    description: "Blush sofisticado com galeria de atelier, carta do casal e composição de moda.",
    implemented: true,
  },
  {
    value: "mozambique-luxe",
    label: "Moçambique Luxe",
    family: "Tradicional Africano / Luxury",
    tone: "xiguiane",
    description: "Herança moçambicana contemporânea com tecido, família, ritual e fotografia premium.",
    implemented: true,
  },
  {
    value: "sunset-destination",
    label: "Sunset Destination",
    family: "Destination / Tropical",
    tone: "rose",
    description: "Experiência de destino com abertura panorâmica, agenda e atmosfera de pôr do sol.",
    implemented: true,
  },
  {
    value: "black-paper",
    label: "Black Paper",
    family: "Editorial / Dark",
    tone: "midnight",
    description: "Papel preto, tipografia monumental e informação em capítulos curtos.",
    implemented: true,
  },
  {
    value: "limintso-emerald",
    label: "Emerald Signature",
    family: "Editorial / Cerimonial / Luxury",
    tone: "sand",
    description: "Convite vertical em cartões, inspirado em experiências de convite premium, com fotografia, bênção, famílias, agenda, RSVP, felicitações e presentes.",
    implemented: true,
  },
  {
    value: "limintso-rose",
    label: "Rose Signature",
    family: "Signature Cards / Romantic",
    tone: "rose",
    description: "Estrutura vertical de cartões, retratos recortados e detalhes blush com acabamento de papelaria.",
    implemented: true,
  },
  {
    value: "limintso-ivory",
    label: "Ivory Signature",
    family: "Signature Cards / Minimal",
    tone: "sand",
    description: "Marfim editorial, fotografia protagonista, molduras finas e ritmo de convite premium.",
    implemented: true,
  },
  {
    value: "limintso-sapphire",
    label: "Sapphire Signature",
    family: "Signature Cards / Destination",
    tone: "sapphire",
    description: "Azul profundo, cartões claros, fotografia costeira e navegação dourada discreta.",
    implemented: true,
  },
  {
    value: "limintso-black",
    label: "Black Signature",
    family: "Signature Cards / Noir",
    tone: "midnight",
    description: "Papel preto, serifas luminosas, fotografia cinematográfica e navegação compacta.",
    implemented: true,
  },
  {
    value: "limintso-forest",
    label: "Forest Signature",
    family: "Signature Cards / Botanical",
    tone: "emerald",
    description: "Verde floresta, marfim quente, retratos em cartões e detalhes botânicos discretos.",
    implemented: true,
  },
  {
    value: "limintso-mozambique",
    label: "Moçambique Signature",
    family: "Signature Cards / Africano",
    tone: "xiguiane",
    description: "Base de cartões premium com paleta terracota, verde e dourado para celebrações moçambicanas.",
    implemented: true,
  },
  {
    value: "pearl-editorial",
    label: "Pearl Editorial",
    family: "Garden / Luxury",
    tone: "rose",
    description: "Pérola contemporânea com fotografia em molduras suaves e ritmo editorial.",
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

  if (/cinema-love-story/i.test(source)) return "cinematic";
  if (/portrait-ceremony|ceremony-editorial/i.test(source)) return "editorial";
  if (/garden-letter|pearl-ceremony/i.test(source)) return "organic";
  if (/heritage-ceremony/i.test(source)) return "heritage";
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
  | "coastal"
  | "cinema"
  | "portrait"
  | "olive"
  | "atelier"
  | "mozambique"
  | "sunset"
  | "paper"
  | "pearl-editorial"
  | "limintso";

export function getTemplateVisualFamily(value?: string | null): TemplateVisualFamily {
  const template = getTemplateDefinition(value);
  const source = `${template.value} ${template.label} ${template.family}`.toLowerCase();

  if (/cinema-love-story|editorial-cinema/.test(source)) return "cinema";
  if (/portrait-ceremony|ivory-portrait|classic-ivory/.test(source)) return "portrait";
  if (/modern-olive|emerald-elegante/.test(source)) return "olive";
  if (/rose-atelier/.test(source)) return "atelier";
  if (/mozambique-luxe|heritage-ceremony/.test(source)) return source.includes("heritage-ceremony") ? "heritage" : "mozambique";
  if (/sunset-destination|sicilian-terracotta|tropical-sunset/.test(source)) return "sunset";
  if (/black-paper/.test(source)) return "paper";
  if (/limintso-/.test(source)) return "limintso";
  if (/pearl-ceremony|pearl-editorial/.test(source)) return "pearl-editorial";
  if (/film-noir|cinematic-charcoal|editorial-dark|midnight-blue/.test(source)) return "cinematic";
  if (/editorial|minimalist|minimalista|sapphire-editorial/.test(source)) return "editorial";
  if (/aquarela|garden|botanical|floral|romantic|boho|tropical/.test(source)) {
    if (/pearl|floral-pearl|pearl-garden/.test(source)) return "pearl";
    return "botanical";
  }
  if (/royal|baroque|oriental|nikah|traditional-bronze/.test(source)) return "royal";
  if (/xiguiane|african|capulana/.test(source)) return "heritage";
  if (/celestial/.test(source)) return "celestial";
  if (/ivory-portrait/.test(source)) return "portrait";
  if (/modern-olive/.test(source)) return "olive";
  if (/rose-atelier/.test(source)) return "atelier";
  if (/mozambique-luxe/.test(source)) return "mozambique";
  if (/sunset-destination/.test(source)) return "sunset";
  if (/pearl-editorial/.test(source)) return "pearl-editorial";
  if (/coastal|destination|mediterranean|sicilian/.test(source)) return "coastal";
  return "classic";
}

export function templateBaseClass(value?: string | null) {
  const special = new Set([
    "film-noir-motion",
    "editorial-magazine",
    "pearl-garden",
    "capulana-contemporary",
    "celestial-ivory",
    "coastal-blue",
    "editorial-cinema",
    "cinema-love-story",
    "black-paper",
    "limintso-emerald",
    "limintso-rose",
    "limintso-ivory",
    "limintso-sapphire",
    "limintso-black",
    "limintso-forest",
    "limintso-mozambique",
  ]);
  return special.has(value ?? "") ? "template-base-signature" : "template-base-standard";
}

export function templateVisualClass(value?: string | null) {
  return `template-visual-${getTemplateVisualFamily(value)}`;
}

export function templateToneClass(value?: string | null) {
  return `invite-tone-${getTemplateDefinition(value).tone} template-layout-${getTemplateLayout(value)}`;
}
