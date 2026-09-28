import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { EventSeals } from "@/components/invite/InvitationSeal";
import { templateToneClass } from "@/lib/templates";
import {
  GALLERY_BUCKET,
  detail,
  eventTitle,
  fetchEventBySlug,
  fetchEventContent,
  formatDatePt,
  signedUrl,
  type EventRow,
  type ScheduleItem,
  parseInviteType,
} from "@/lib/event";

export const Route = createFileRoute("/$slug/imprimir")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    tipo: parseInviteType(search["tipo"]) ?? undefined,
    formato: search["formato"] === "a6" ? "a6" : "a5",
  }),
  head: ({ params }) => ({
    meta: [
      { title: `Convite para imprimir — ${params.slug}` },
      { name: "description", content: "Versão para impressão física do convite digital Solar Eclipse." },
      { property: "og:title", content: "Convite para imprimir — Solar Eclipse" },
      { property: "og:description", content: "Versão para impressão física do convite digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrintPage,
});

type ProgramLine = { key: string; time: string | null; title: string; sub: string | null };

function buildProgram(event: EventRow, schedule: ScheduleItem[]): ProgramLine[] {
  if (schedule.length > 0) {
    return schedule.map((s) => ({ key: s.id, time: s.time_label, title: s.title, sub: s.description }));
  }
  const d = (f: Parameters<typeof detail>[1]) => detail(event, f);
  return [
    { key: "civil", time: d("civil_ceremony_time"), title: "Cerimónia Civil", sub: d("civil_ceremony_venue") },
    { key: "cerimonia", time: d("ceremony_time"), title: "Cerimónia", sub: d("ceremony_venue") },
    { key: "rececao", time: d("reception_time"), title: "Receção", sub: d("reception_venue") },
  ].filter((r) => r.time || r.sub);
}

function parentsLine(event: EventRow, side: "groom" | "bride") {
  const m = detail(event, `${side}_mother_name`);
  const f = detail(event, `${side}_father_name`);
  return [m, f].filter(Boolean).join(" e ");
}

async function imageToDataUrl(url: string): Promise<{ data: string; format: "JPEG" | "PNG" } | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const format = blob.type.includes("png") ? "PNG" : "JPEG";
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return { data, format };
  } catch {
    return null;
  }
}

async function generatePdf(event: EventRow, program: ProgramLine[], coverUrl: string | null, inviteType: ReturnType<typeof parseInviteType>, format: "a5" | "a6") {
  const palette = event.template.includes("xiguiane") || event.template.includes("african")
    ? { dark: [17, 35, 28] as [number, number, number], accent: [31, 125, 89] as [number, number, number], light: [225, 238, 226] as [number, number, number] }
    : event.template.includes("midnight") || event.template.includes("sapphire") || event.template.includes("editorial-dark") || event.template.includes("cinematic")
      ? { dark: [12, 20, 38] as [number, number, number], accent: [116, 169, 224] as [number, number, number], light: [220, 231, 244] as [number, number, number] }
      : event.template.includes("rose") || event.template.includes("romantic") || event.template.includes("floral") || event.template.includes("tropical-sunset")
        ? { dark: [48, 25, 33] as [number, number, number], accent: [205, 124, 145] as [number, number, number], light: [242, 221, 226] as [number, number, number] }
        : event.template.includes("oriental") || event.template.includes("nikah")
          ? { dark: [46, 18, 20] as [number, number, number], accent: [211, 166, 72] as [number, number, number], light: [244, 228, 190] as [number, number, number] }
          : { dark: [18, 16, 14] as [number, number, number], accent: [201, 168, 76] as [number, number, number], light: [222, 196, 145] as [number, number, number] };
  const GOLD = palette.accent;
  const CHAMPAGNE = palette.light;
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format, orientation: "portrait" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const cx = W / 2;

  // Fundo
  doc.setFillColor(...palette.dark);
  doc.rect(0, 0, W, H, "F");
  const img = coverUrl ? await imageToDataUrl(coverUrl) : null;
  if (img) {
    try {
      doc.addImage(img.data, img.format, 0, 0, W, H, undefined, "FAST");
    } catch {
      /* mantém fundo sólido */
    }
    doc.saveGraphicsState();
    doc.setGState(new (doc as unknown as { GState: new (o: { opacity: number }) => unknown }).GState({ opacity: 0.68 }));
    doc.setFillColor(...palette.dark);
    doc.rect(0, 0, W, H, "F");
    doc.restoreGraphicsState();
  }

  // Moldura dourada
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.rect(7, 7, W - 14, H - 14);
  doc.setLineWidth(0.2);
  doc.rect(9, 9, W - 18, H - 18);

  const center = (text: string, y: number, size: number, font: "times" | "helvetica", style: string, color: [number, number, number], spacing = 0) => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setCharSpace(spacing);
    doc.text(text, cx, y, { align: "center" });
    doc.setCharSpace(0);
  };

  let y = 26;
  center("CONVITE", y, 8, "helvetica", "normal", GOLD, 1.5);

  const groom = detail(event, "groom_name");
  const bride = detail(event, "bride_name");
  y += 18;
  if (groom && bride) {
    center(bride, y, 26, "times", "normal", GOLD);
    y += 10;
    center("&", y, 14, "times", "italic", CHAMPAGNE);
    y += 12;
    center(groom, y, 26, "times", "normal", GOLD);
  } else {
    const lines = doc.splitTextToSize(eventTitle(event), W - 40) as string[];
    doc.setFont("times", "normal");
    doc.setFontSize(24);
    doc.setTextColor(...GOLD);
    doc.text(lines, cx, y, { align: "center" });
    y += (lines.length - 1) * 10 + 12;
  }

  // Ornamento
  y += 7;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(cx - 22, y, cx - 4, y);
  doc.line(cx + 4, y, cx + 22, y);
  doc.setFillColor(...GOLD);
  doc.circle(cx, y, 0.9, "F");

  const gp = parentsLine(event, "groom");
  const bp = parentsLine(event, "bride");
  if (gp || bp) {
    y += 7;
    center("FILHOS DE", y, 7, "helvetica", "normal", CHAMPAGNE, 1);
    if (bp) {
      y += 5;
      center(bp, y, 9.5, "times", "italic", CHAMPAGNE);
    }
    if (gp) {
      y += 5;
      center(gp, y, 9.5, "times", "italic", CHAMPAGNE);
    }
  }

  y += 10;
  center(
    "Têm a honra de convidar para a celebração do seu casamento",
    y,
    9,
    "times",
    "italic",
    CHAMPAGNE,
  );

  y += 10;
  center(formatDatePt(event.event_date).toUpperCase(), y, 11, "helvetica", "normal", GOLD, 1.2);

  const sealEnabled = detail(event, "seal_enabled") === "true";
  const sealMode = inviteType === "individual" ? "one" : inviteType === "casal" ? "two" : detail(event, "seal_mode");
  const sealOne = detail(event, "seal_one_text");
  const sealTwo = detail(event, "seal_two_text");
  if (sealEnabled && (sealOne || sealTwo)) {
    y += 7;
    const seals = sealMode === "two" && sealTwo ? [sealOne, sealTwo].filter(Boolean) : [sealOne].filter(Boolean);
    const gap = seals.length === 2 ? 30 : 0;
    seals.forEach((seal, index) => {
      const x = cx + (index === 0 ? -gap / 2 : gap / 2);
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.4);
      doc.circle(x, y, 9);
      doc.setLineWidth(0.2);
      doc.circle(x, y, 7.5);
      doc.setFont("times", "normal");
      doc.setFontSize(14);
      doc.setTextColor(...GOLD);
      doc.text(String(seal), x, y + 2, { align: "center" });
    });
    y += 13;
  }

  const verse = detail(event, "verse_text");
  if (verse) {
    y += 9;
    const vlines = doc.splitTextToSize(`“${verse}”`, W - 44) as string[];
    doc.setFont("times", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...CHAMPAGNE);
    doc.text(vlines, cx, y, { align: "center" });
    y += vlines.length * 4;
    const ref = detail(event, "verse_reference");
    if (ref) center(ref, y, 7.5, "helvetica", "normal", GOLD, 0.8);
  }

  if (program.length) {
    y += 11;
    center("PROGRAMA DO DIA", y, 8, "helvetica", "normal", GOLD, 1.5);
    y += 6;
    for (const p of program.slice(0, 6)) {
      const title = [p.time, p.title].filter(Boolean).join("  ·  ");
      center(title, y, 9.5, "times", "normal", GOLD);
      if (p.sub) {
        y += 4.2;
        const sub = doc.splitTextToSize(p.sub, W - 50) as string[];
        center(sub[0] ?? "", y, 8, "helvetica", "normal", CHAMPAGNE);
      }
      y += 6.5;
      if (y > H - 30) break;
    }
  }

  const contact = [event.contact_1_name, event.contact_1_phone].filter(Boolean).join(" · ");
  const rsvp = event.rsvp_deadline ? `Confirmar presença até ${formatDatePt(event.rsvp_deadline)}` : null;
  let fy = H - 22;
  if (rsvp) {
    center(rsvp, fy, 7.5, "helvetica", "normal", CHAMPAGNE, 0.5);
    fy += 4.5;
  }
  if (contact) center(contact, fy, 7.5, "helvetica", "normal", CHAMPAGNE, 0.5);
  if (event.hashtag) center(event.hashtag, H - 13, 7, "helvetica", "normal", GOLD, 1);

  doc.save("convite-" + event.slug + "-" + format + (inviteType ? "-" + inviteType : "") + ".pdf");
}

function PrintPage() {
  const { slug } = Route.useParams();
  const { tipo: inviteType, formato } = Route.useSearch();
  const [cover, setCover] = useState<string | null>(null);
  const [coverVideo, setCoverVideo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const e = await fetchEventBySlug(slug);
      if (!e) throw notFound();
      return e;
    },
  });

  const { data: content } = useQuery({
    queryKey: ["event-content", event?.id],
    enabled: !!event,
    queryFn: () => fetchEventContent(event!.id),
  });

  useEffect(() => {
    if (!event) return;
    signedUrl(GALLERY_BUCKET, event.cover_image_path).then(setCover);
  }, [event]);

  useEffect(() => {
    if (!content?.media?.length) return;
    const coverMedia = content.media.find((item) => item.slot === "cover");
    const videoMedia = content.media.find((item) => item.slot === "cover_video");
    if (coverMedia && !cover) signedUrl(GALLERY_BUCKET, coverMedia.storage_path).then(setCover);
    if (videoMedia) signedUrl(GALLERY_BUCKET, videoMedia.storage_path).then(setCoverVideo);
  }, [content, cover]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans text-xs tracking-[0.3em] text-muted-foreground uppercase">
        A carregar…
      </div>
    );
  }
  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-light">Convite não encontrado</h1>
      </div>
    );
  }

  const program = buildProgram(event, content?.schedule ?? []);
  const groom = detail(event, "groom_name");
  const bride = detail(event, "bride_name");
  const gp = parentsLine(event, "groom");
  const bp = parentsLine(event, "bride");
  const verse = detail(event, "verse_text");
  const verseRef = detail(event, "verse_reference");

  async function downloadPdf() {
    setBusy(true);
    try {
      await generatePdf(event!, program, cover, inviteType, formato);
    } catch {
      toast.error("Não foi possível gerar o PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={`${templateToneClass(event.template)} template-design-${event.template} print-page min-h-screen bg-[oklch(0.12_0.01_70)] px-4 py-10 font-serif text-[rgb(222,196,145)]">
      <div className="print-actions mx-auto mb-8 flex max-w-md flex-wrap justify-center gap-3">
        <a
          href={inviteType ? `?tipo=${inviteType === "individual" ? "casal" : "individual"}&formato=${formato}` : `?formato=${formato}`}
          className="rounded-sm border border-[rgb(201,168,76)] px-6 py-3 font-sans text-[0.7rem] tracking-[0.3em] text-[rgb(201,168,76)] uppercase transition-colors hover:bg-[rgb(201,168,76)]/10"
        >
          {inviteType === "individual" ? "Ver versão casal" : inviteType === "casal" ? "Ver versão individual" : "Escolher versão"}
        </a>
        <button
          type="button"
          disabled={busy}
          onClick={downloadPdf}
          className="rounded-sm bg-[rgb(201,168,76)] px-6 py-3 font-sans text-[0.7rem] tracking-[0.3em] text-[oklch(0.15_0.02_70)] uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "A gerar…" : "Baixar Convite em PDF"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-sm border border-[rgb(201,168,76)] px-6 py-3 font-sans text-[0.7rem] tracking-[0.3em] text-[rgb(201,168,76)] uppercase transition-colors hover:bg-[rgb(201,168,76)]/10"
        >
          Imprimir Agora
        </button>
      </div>

      <article
        className="print-sheet relative mx-auto aspect-[148/210] w-full max-w-md overflow-hidden bg-[oklch(0.12_0.01_70)] text-center"
        style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        {coverVideo && (
          <video
            src={coverVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={cover ?? undefined}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[rgb(12,10,8)]/70" />
        <div className="pointer-events-none absolute inset-3 border border-[rgb(201,168,76)]" />
        <div className="pointer-events-none absolute inset-4 border border-[rgb(201,168,76)]/50" />

        <div className="relative flex h-full flex-col items-center justify-between px-8 py-10">
          <div className="w-full">
            <p className="font-sans text-[0.6rem] tracking-[0.4em] text-[rgb(201,168,76)] uppercase">Convite</p>
            {groom && bride ? (
              <h1 className="mt-6 leading-tight font-light text-[rgb(201,168,76)]">
                <span className="block text-3xl">{bride}</span>
                <span className="my-1 block text-lg italic text-[rgb(222,196,145)]">&amp;</span>
                <span className="block text-3xl">{groom}</span>
              </h1>
            ) : (
              <h1 className="mt-6 text-3xl leading-tight font-light text-[rgb(201,168,76)]">{eventTitle(event)}</h1>
            )}

            <div className="mx-auto mt-5 flex items-center justify-center gap-2">
              <span className="h-px w-10 bg-[rgb(201,168,76)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(201,168,76)]" />
              <span className="h-px w-10 bg-[rgb(201,168,76)]" />
            </div>

            {(gp || bp) && (
              <div className="mt-4 text-sm italic">
                <p className="font-sans text-[0.55rem] tracking-[0.3em] uppercase not-italic">Filhos de</p>
                {bp && <p className="mt-1">{bp}</p>}
                {gp && <p>{gp}</p>}
              </div>
            )}

            <p className="mt-5 text-sm italic">Têm a honra de convidar para a celebração do seu casamento</p>
            <p className="mt-4 font-sans text-xs tracking-[0.3em] text-[rgb(201,168,76)] uppercase">
              {formatDatePt(event.event_date)}
            </p>

            <div className="mt-4">
              <EventSeals
                tipo={inviteType}
                enabled={detail(event, "seal_enabled")}
                mode={detail(event, "seal_mode")}
                oneText={detail(event, "seal_one_text")}
                twoText={detail(event, "seal_two_text")}
                oneLabel={detail(event, "seal_one_label")}
                twoLabel={detail(event, "seal_two_label")}
                oneColor={detail(event, "seal_one_color")}
                twoColor={detail(event, "seal_two_color")}
              />
            </div>

            {verse && (
              <div className="mt-5 text-xs italic">
                <p>“{verse}”</p>
                {verseRef && (
                  <p className="mt-1 font-sans text-[0.55rem] tracking-[0.2em] text-[rgb(201,168,76)] uppercase not-italic">
                    {verseRef}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="w-full">
            {program.length > 0 && (
              <div className="mt-6">
                <p className="font-sans text-[0.6rem] tracking-[0.4em] text-[rgb(201,168,76)] uppercase">Programa do Dia</p>
                <ul className="mt-3 space-y-2">
                  {program.slice(0, 6).map((p) => (
                    <li key={p.key}>
                      <p className="text-sm text-[rgb(201,168,76)]">
                        {[p.time, p.title].filter(Boolean).join("  ·  ")}
                      </p>
                      {p.sub && <p className="font-sans text-[0.65rem]">{p.sub}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 font-sans text-[0.6rem] tracking-[0.15em]">
              {event.rsvp_deadline && <p>Confirmar presença até {formatDatePt(event.rsvp_deadline)}</p>}
              {(event.contact_1_name || event.contact_1_phone) && (
                <p className="mt-1">{[event.contact_1_name, event.contact_1_phone].filter(Boolean).join(" · ")}</p>
              )}
              {event.hashtag && (
                <p className="mt-2 tracking-[0.3em] text-[rgb(201,168,76)] uppercase">{event.hashtag}</p>
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
