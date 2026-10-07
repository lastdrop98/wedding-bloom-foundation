import { CalendarDays, Heart, MapPin, Play, Share2 } from "lucide-react";
import type { TemplateDefinition } from "@/lib/templates";

const photos = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85",
];

export function LimintsoSignaturePreview({ template }: { template: TemplateDefinition }) {
  return (
    <div className="limintso-preview bg-[#f6f3ee] text-[#51483d]">
      <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#c9a84c]/15 bg-[#fbfaf7]/95 px-5 backdrop-blur-xl">
        <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.16em]"><span className="grid size-6 place-items-center rounded-full border border-[#c9a84c]/50 text-[7px]">SE</span> Solar Eclipse</span>
        <div className="flex gap-2"><button className="grid size-7 place-items-center rounded-full border border-black/10"><Share2 className="size-3" /></button><button className="grid size-7 place-items-center rounded-full border border-black/10">☰</button></div>
      </div>

      <section data-demo-section="capa" className="relative mx-4 mt-4 h-[600px] overflow-hidden rounded-[24px] shadow-xl">
        <img src={photos[0]} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        <div className="absolute inset-x-5 bottom-8 text-center text-white">
          <p className="text-[8px] uppercase tracking-[.3em] text-white/70">A união matrimonial de</p>
          <h2 className="mt-3 font-serif text-6xl leading-[.8] tracking-[-.06em]">Ana &amp; Miguel</h2>
          <p className="mt-5 text-[9px] uppercase tracking-[.25em]">24 de Outubro de 2027</p>
        </div>
      </section>

      <div className="flex justify-between px-6 py-4">
        <span className="grid size-8 place-items-center rounded-full border border-black/10 bg-white"><Play className="size-3" /></span>
        <span className="grid size-8 place-items-center rounded-full border border-black/10 bg-white"><Heart className="size-3" /></span>
      </div>

      {[
        ["boas-vindas","Aliança Inabalável","“Aqui é o nosso lar, erguido com amor, fé e a bênção de Deus.”"],
        ["familia","Família","Os nomes e famílias dos noivos aparecem em cartões individuais."],
        ["historia","A nossa história","Capítulos, fotografias e vídeo contam a história do casal."],
      ].map(([id,title,text], index) => (
        <section key={id} data-demo-section={id} className={`border-t border-black/5 px-6 py-14 ${index === 1 ? "bg-[#191817] text-white" : "bg-[#fbfaf7]"}`}>
          <p className={`text-[8px] font-semibold uppercase tracking-[.25em] ${index === 1 ? "text-[#d7b56d]" : "text-[#9d8553]"}`}>{id === "familia" ? "Família e convidados" : "Com carinho"}</p>
          <h3 className="mt-3 font-serif text-4xl italic">{title}</h3>
          <p className={`mt-5 text-sm leading-7 ${index === 1 ? "text-white/65" : "text-[#756b5d]"}`}>{text}</p>
          {index === 2 && <img src={photos[1]} alt="" className="mt-7 h-56 w-full rounded-3xl object-cover" />}
        </section>
      ))}

      <section data-demo-section="programa" className="border-t border-black/5 bg-white px-6 py-14">
        <p className="text-[8px] font-semibold uppercase tracking-[.25em] text-[#9d8553]">Programa</p>
        <h3 className="mt-3 font-serif text-4xl italic">Um dia para guardar</h3>
        <div className="mt-7 space-y-3">
          {["11:00 · Cerimónia","13:00 · Receção","16:00 · Festa"].map((item) => <div key={item} className="flex items-center gap-4 rounded-2xl border border-black/10 bg-[#fbfaf7] p-5"><CalendarDays className="size-4 text-[#a88d58]" /><span className="font-serif text-xl italic">{item}</span></div>)}
        </div>
      </section>

      <section data-demo-section="local" className="border-t border-black/5 bg-[#f6f3ee] px-6 py-14">
        <p className="text-[8px] font-semibold uppercase tracking-[.25em] text-[#9d8553]">Onde vamos celebrar</p>
        <h3 className="mt-3 font-serif text-4xl italic">Localização</h3>
        <div className="mt-7 rounded-3xl border border-black/10 bg-white p-6"><MapPin className="size-5 text-[#a88d58]" /><p className="mt-4 font-serif text-2xl italic">Paróquia / Espaço da receção</p><p className="mt-2 text-sm text-black/50">Maputo, Moçambique</p><button className="mt-5 rounded-full border border-[#c9a84c]/45 px-4 py-2 text-[8px] font-semibold uppercase tracking-[.16em]">Ver mapa</button></div>
      </section>

      <section data-demo-section="galeria" className="border-t border-black/5 bg-white px-6 py-14">
        <p className="text-[8px] font-semibold uppercase tracking-[.25em] text-[#9d8553]">Memórias</p>
        <h3 className="mt-3 font-serif text-4xl italic">Galeria</h3>
        <div className="mt-7 grid grid-cols-2 gap-2">
          {photos.map((photo, i) => <img key={photo} src={photo} alt="" className={`w-full rounded-2xl object-cover ${i===0 ? "row-span-2 h-[360px]" : "h-44"}`} />)}
        </div>
      </section>

      <section data-demo-section="rsvp" className="border-t border-black/5 bg-[#fbfaf7] px-6 py-14">
        <p className="text-[8px] font-semibold uppercase tracking-[.25em] text-[#9d8553]">Confirme a sua presença</p>
        <h3 className="mt-3 font-serif text-4xl italic">RSVP</h3>
        <div className="mt-7 space-y-3">
          <div className="h-12 rounded-xl border border-black/10 bg-white px-4 py-3 text-xs text-black/35">Nome completo</div>
          <div className="grid grid-cols-2 gap-2"><button className="rounded-xl border border-[#c9a84c] bg-[#c9a84c] py-3 text-[9px] uppercase tracking-[.12em] text-white">Vou participar</button><button className="rounded-xl border border-black/10 bg-white py-3 text-[9px] uppercase tracking-[.12em]">Não vou</button></div>
          <button className="w-full rounded-full bg-[#c9a84c] py-3 text-[9px] font-semibold uppercase tracking-[.16em] text-white">Confirmar presença</button>
        </div>
      </section>

      <section data-demo-section="felicitacoes" className="border-t border-black/5 bg-[#f6f3ee] px-6 py-14">
        <p className="text-[8px] font-semibold uppercase tracking-[.25em] text-[#9d8553]">Deixe uma mensagem</p>
        <h3 className="mt-3 font-serif text-4xl italic">Felicitações</h3>
        <div className="mt-7 rounded-2xl border border-black/10 bg-white p-5"><div className="h-20 rounded-xl border border-black/10" /><button className="mt-3 w-full rounded-full bg-black py-3 text-[9px] uppercase tracking-[.16em] text-white">Enviar</button></div>
      </section>

      <section data-demo-section="presentes" className="border-t border-black/5 bg-white px-6 py-14">
        <p className="text-[8px] font-semibold uppercase tracking-[.25em] text-[#9d8553]">Com carinho</p>
        <h3 className="mt-3 font-serif text-4xl italic">Presentes</h3>
        <div className="mt-7 rounded-2xl border border-black/10 p-5 text-sm leading-7">Dados bancários<br/>M-Pesa · e-Mola<br/><span className="text-[#9d8553]">QR Code</span></div>
      </section>

      <footer data-demo-section="closing" className="bg-[#151414] px-6 py-16 text-center text-white">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-[#d7b56d]/50 text-[9px] text-[#d7b56d]">SE</span>
        <p className="mt-4 text-[8px] uppercase tracking-[.22em] text-white/45">Convite criado com carinho por</p>
        <p className="mt-2 font-serif text-2xl italic">Solar Eclipse</p>
      </footer>
      <div className="sticky bottom-3 z-20 mx-3 mt-[-56px] grid grid-cols-5 rounded-2xl border border-black/10 bg-white/90 p-1 shadow-2xl backdrop-blur"><span className="py-3 text-center text-[7px] uppercase">Capa</span><span className="py-3 text-center text-[7px] uppercase">Programa</span><span className="py-3 text-center text-[7px] uppercase">Mapa</span><span className="py-3 text-center text-[7px] uppercase">RSVP</span><span className="py-3 text-center text-[7px] uppercase">Presentes</span></div>
      <p className="px-6 pb-10 pt-5 text-center text-[8px] uppercase tracking-[.2em] text-black/30">{template.label} · demonstração</p>
    </div>
  );
}
