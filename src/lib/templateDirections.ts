import type { TemplateDefinition } from "@/lib/templates";

export type TemplateDirection = {
  structure: string;
  design: string;
  appearance: string;
  typography: string;
  palette: string;
  motifs: string;
};

const DIRECTIONS: Array<{ match: RegExp; direction: TemplateDirection }> = [
  {
    match: /xiguiane|african/i,
    direction: {
      structure: "Capa cerimonial + história + família + programa + RSVP",
      design: "Editorial africano contemporâneo com blocos assimétricos e selos",
      appearance: "Capulana, textura artesanal, terra e verde, acabamento premium",
      typography: "Serif elegante + sans limpa para informação",
      palette: "Terracota, areia, verde profundo e bronze",
      motifs: "Padrões têxteis, molduras, selos e geometrias inspiradas na herança moçambicana",
    },
  },
  {
    match: /garden|botanical|floral|romantic/i,
    direction: {
      structure: "Capa leve + história + galeria + programa + RSVP + mensagens",
      design: "Composição orgânica, respirada e centrada no casal",
      appearance: "Papel claro, aguarela, flores e folhagem delicada",
      typography: "Serif editorial + script pontual",
      palette: "Marfim, blush, verde folha e rosa antigo",
      motifs: "Ramos, flores, manchas de aguarela e linhas orgânicas",
    },
  },
  {
    match: /royal|baroque|nikah|oriental|heritage/i,
    direction: {
      structure: "Capa de impacto + cerimónia + família + programa + confirmação",
      design: "Composição simétrica, molduras e hierarquia cerimonial",
      appearance: "Luxo clássico, ornamentado e inspirado em papelaria física",
      typography: "Serif de alto contraste + pequenos textos em caixa alta",
      palette: "Jóias profundas, marfim e dourado antigo",
      motifs: "Molduras, arabescos, geometrias e ornamentos cerimoniais",
    },
  },
  {
    match: /film-noir-motion/i,
    direction: {
      structure: "Capa em vídeo + manifesto + casal + momentos + programa + RSVP",
      design: "Cinematografia editorial com hero em ecrã inteiro e transições de filme",
      appearance: "Preto carvão, grão de película, fotografia dramática e detalhes dourados",
      typography: "Serif cinematográfica + sans condensada",
      palette: "Carvão, marfim, dourado queimado e preto",
      motifs: "Frames de filme, números de cena, linhas de timeline e créditos finais",
    },
  },
  {
    match: /editorial-magazine/i,
    direction: {
      structure: "Capa editorial + índice + história + galeria + programa + RSVP",
      design: "Revista de moda com colunas, títulos grandes e fotografia recortada",
      appearance: "Luxo contemporâneo, branco quente e fotografia protagonista",
      typography: "Serif fashion + sans editorial",
      palette: "Marfim, preto, taupe e bronze",
      motifs: "Números gigantes, filetes, legendas e composição assimétrica",
    },
  },
  {
    match: /pearl-garden/i,
    direction: {
      structure: "Capa botânica + carta + casal + jardim de memórias + programa + RSVP",
      design: "Composição orgânica assimétrica com molduras de pérola",
      appearance: "Romântico, luminoso e delicado sem parecer infantil",
      typography: "Serif elegante + script pontual",
      palette: "Pérola, blush, verde sálvia e champagne",
      motifs: "Pérolas, flores finas, folhas e manchas suaves",
    },
  },
  {
    match: /capulana-contemporary/i,
    direction: {
      structure: "Capa têxtil + família + história + cerimónias + programa + RSVP",
      design: "Editorial moçambicano contemporâneo com módulos têxteis e diagonais",
      appearance: "Capulana sofisticada, textura artesanal e fotografia de grande escala",
      typography: "Serif forte + sans geométrica",
      palette: "Terracota, verde profundo, areia, azul petróleo e bronze",
      motifs: "Grafismos têxteis, selos, diagonais e linhas de costura",
    },
  },
  {
    match: /celestial-ivory/i,
    direction: {
      structure: "Capa celestial + mensagem + casal + constelação + programa + RSVP",
      design: "Minimalismo de luxo com mapa estelar e muito espaço negativo",
      appearance: "Marfim, dourado e céu profundo em pequenos pontos de contraste",
      typography: "Serif refinada + sans microtipográfica",
      palette: "Marfim, dourado, preto e azul-noite",
      motifs: "Constelações, órbitas, pontos de luz e linhas finíssimas",
    },
  },
  {
    match: /coastal-blue/i,
    direction: {
      structure: "Capa fotográfica + destino + casal + agenda + galeria + RSVP",
      design: "Destination editorial com fotografia panorâmica e blocos fluidos",
      appearance: "Fresco, elegante e solar",
      typography: "Serif leve + sans humanista",
      palette: "Azul oceano, areia, branco quente e dourado suave",
      motifs: "Ondas abstratas, linhas costeiras e coordenadas",
    },
  },
  {
    match: /minimal|editorial|cinematic/i,
    direction: {
      structure: "Capa editorial + mensagem + momentos + programa + RSVP",
      design: "Grid, espaço negativo e fotografia como elemento principal",
      appearance: "Galeria de moda, silenciosa, sofisticada e contemporânea",
      typography: "Serif editorial grande + sans geométrica",
      palette: "Neutros, preto, branco, vinho ou azul profundo",
      motifs: "Linhas finas, números editoriais, cortes fotográficos e microtipografia",
    },
  },
  {
    match: /boho|mediterranean|tropical/i,
    direction: {
      structure: "Capa fotográfica + história + local + programa + galeria + RSVP",
      design: "Blocos descontraídos, fotografia ampla e detalhes artesanais",
      appearance: "Destino, natureza, calor e textura sem perder sofisticação",
      typography: "Serif suave + sans humanista",
      palette: "Areia, terracota, azul costeiro, verde e pôr do sol",
      motifs: "Texturas naturais, folhas, linhas desenhadas e formas orgânicas",
    },
  },
  {
    match: /vintage|traditional|classic|european/i,
    direction: {
      structure: "Convite clássico + família + cerimónia + receção + confirmação",
      design: "Papelaria tradicional com hierarquia clara e molduras discretas",
      appearance: "Convite físico premium traduzido para o digital",
      typography: "Serif clássica + small caps",
      palette: "Marfim, creme, castanho, bronze e dourado suave",
      motifs: "Molduras, filetes, monogramas e selos",
    },
  },
];

const DEFAULT_DIRECTION: TemplateDirection = {
  structure: "Capa + história + programa + galeria + RSVP + entrega",
  design: "Editorial premium com composição equilibrada",
  appearance: "Minimalismo luxuoso com fotografia e detalhes refinados",
  typography: "Serif editorial + sans contemporânea",
  palette: "Neutros sofisticados com uma cor de assinatura",
  motifs: "Linhas finas, selos e detalhes gráficos discretos",
};

export function getTemplateDirection(template: TemplateDefinition): TemplateDirection {
  const source = template.value + " " + template.label + " " + template.family;
  return DIRECTIONS.find(({ match }) => match.test(source))?.direction ?? DEFAULT_DIRECTION;
}
