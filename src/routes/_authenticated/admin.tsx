import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { coupleTitle, formatDatePt, type Wedding } from "@/lib/wedding";
import { WeddingForm } from "@/components/WeddingForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Solar Eclipse" },
      { name: "description", content: "Gestão de convites de casamento Solar Eclipse." },
      { property: "og:title", content: "Painel — Solar Eclipse" },
      { property: "og:description", content: "Gestão de convites de casamento Solar Eclipse." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Wedding | null | undefined>(undefined);

  const { data: weddings, isLoading } = useQuery({
    queryKey: ["admin-weddings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weddings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function closeForm() {
    setEditing(undefined);
    void queryClient.invalidateQueries({ queryKey: ["admin-weddings"] });
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Solar Eclipse</p>
          <h1 className="mt-2 text-3xl font-light">Painel de casamentos</h1>
        </div>
        <div className="flex gap-2">
          {editing === undefined && <Button onClick={() => setEditing(null)}>Novo Casamento</Button>}
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </div>
      </div>

      <span className="gold-rule mt-8" />

      {editing !== undefined ? (
        <div className="mt-10 rounded-md border border-border bg-card p-6">
          <h2 className="mb-6 text-xl font-light">
            {editing ? `Editar — ${coupleTitle(editing)}` : "Novo casamento"}
          </h2>
          <WeddingForm
            wedding={editing}
            onSaved={closeForm}
            onCancel={() => setEditing(undefined)}
          />
        </div>
      ) : isLoading ? (
        <p className="mt-10 text-muted-foreground">A carregar…</p>
      ) : !weddings?.length ? (
        <p className="mt-10 text-muted-foreground">Ainda não existem casamentos.</p>
      ) : (
        <ul className="mt-10 space-y-3">
          {weddings.map((w) => (
            <li
              key={w.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card px-5 py-4"
            >
              <div>
                <p className="text-lg">{coupleTitle(w)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDatePt(w.wedding_date)} · /{w.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/$slug" params={{ slug: w.slug }}>
                    Ver convite
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(w)}>
                  Editar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
