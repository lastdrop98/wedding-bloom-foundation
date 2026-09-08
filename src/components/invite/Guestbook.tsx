import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

type Entry = { id: string; name: string; message: string; created_at: string };

export function Guestbook({ eventId }: { eventId: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("guestbook")
      .select("id,name,message,created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    setEntries(data ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Escreva o seu nome e a sua mensagem.");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("guestbook")
      .insert({ event_id: eventId, name: name.trim(), message: message.trim() });
    setBusy(false);
    if (error) {
      toast.error("Não foi possível enviar o recado.");
      return;
    }
    toast.success("Obrigado pelo seu recado!");
    setName("");
    setMessage("");
    void load();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={submit} className="grid gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="O seu nome"
          className="w-full rounded-md border border-primary/30 bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-primary"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Deixe uma mensagem carinhosa…"
          className="w-full rounded-md border border-primary/30 bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy}
          className="justify-self-center rounded-full border border-primary px-8 py-3 font-sans text-[0.7rem] tracking-[0.3em] text-primary uppercase transition-colors hover:bg-primary/10 disabled:opacity-60"
        >
          {busy ? "A enviar…" : "Deixar recado"}
        </button>
      </form>

      {entries.length > 0 && (
        <ul className="mt-10 grid gap-4">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-md border border-primary/20 p-5 text-left">
              <p className="font-sans text-sm whitespace-pre-line text-muted-foreground">
                “{entry.message}”
              </p>
              <p className="mt-3 text-sm tracking-[0.2em] text-primary uppercase">{entry.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Guestbook;
