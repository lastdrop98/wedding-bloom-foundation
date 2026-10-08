import type { TemplateDefinition } from "@/lib/templates";
import type { EventRow } from "@/lib/event";
import { LimintsoSignatureHome } from "./SignatureHome";

const photos = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85",
];

/** Data-only adapter: demos never load or write a real event. */
export function LimintsoSignaturePreview({ template }: { template: TemplateDefinition }) {
  const event: EventRow = {
    id: "signature-demonstration", slug: "demonstracao", template: template.value,
    event_type: "casamento", display_names: "Ana & Miguel", event_date: "2027-10-24T11:00:00",
    created_at: "2026-01-01", cover_image_path: null, music_path: null, hashtag: null,
    rsvp_deadline: "2027-10-01", contact_1_name: null, contact_1_phone: null, contact_2_name: null, contact_2_phone: null,
    details: {
      bride_name: "Ana", groom_name: "Miguel",
      welcome_message: "Com o coração cheio de alegria, convidamo-vos a celebrar o início da nossa vida a dois.",
      verse_text: "O amor tudo sofre, tudo crê, tudo espera, tudo suporta.", verse_reference: "1 Coríntios 13:7",
      story_intro: "Há encontros que mudam para sempre o rumo de uma vida. Este foi o nosso.",
      story_1_date: "2021", story_1_title: "O primeiro encontro", story_1_text: "Uma conversa inesperada tornou-se o primeiro capítulo da nossa história.",
      story_2_date: "2025", story_2_title: "Um sim para sempre", story_2_text: "Entre sorrisos e promessas, escolhemos caminhar juntos.",
      party_1_name: "Inês & Pedro", party_1_role: "Padrinhos", party_2_name: "Sofia & Daniel", party_2_role: "Padrinhos",
      ceremony_venue: "Jardim das Acácias · local fictício", ceremony_address: "Maputo, Moçambique", ceremony_time: "11:00",
      reception_venue: "Casa do Jardim · local fictício", reception_time: "13:00", reception_address: "Maputo, Moçambique",
      bank_name: "Banco de demonstração", bank_holder: "Ana & Miguel · DEMONSTRAÇÃO", bank_nib: "DEMONSTRAÇÃO — NÃO TRANSFERIR",
    },
  };
  return <div className="signature-demo-adapter">
    <p className="signature-demo-label">{template.label} · DEMONSTRAÇÃO</p>
    <LimintsoSignatureHome preview event={event} cover={photos[0]} slotMedia={{ bride: { url: photos[2] ?? "", mediaType: "image" }, groom: { url: photos[3] ?? "", mediaType: "image" }, story: { url: photos[1] ?? "", mediaType: "image" } }}
      content={{ schedule: [ { id: "ceremony", time_label: "11:00", title: "Cerimónia", description: "Jardim das Acácias · local fictício" }, { id: "reception", time_label: "13:00", title: "Receção", description: "Casa do Jardim · local fictício" }, { id: "party", time_label: "16:00", title: "Celebração", description: "Música, brindes e memórias" } ], gifts: [{ id: "demo-gift", title: "A nossa lua de mel", description: "A vossa presença é o nosso maior presente." }] }}
      galleryUrls={photos.map((url, index) => ({ url, caption: `O nosso momento ${index + 1}`, mediaType: "image" }))} galleryMediaUrls={[]} giftPhotos={{ "demo-gift": photos[1] ?? "" }} />
  </div>;
}
