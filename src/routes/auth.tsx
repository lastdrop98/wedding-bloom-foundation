import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { EclipseMark } from "@/components/EclipseMark";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?fm=jpg&q=85&w=1800&auto=format&fit=crop";

type AuthReason = "entrar" | "expirada" | "permissao" | "erro";
const REASON_TEXT: Record<AuthReason, string> = {
  entrar: "Inicie sessão para aceder à área de administração.",
  expirada: "A sua sessão expirou. Entre novamente para continuar.",
  permissao: "Esta conta não tem permissões de administrador.",
  erro: "Não foi possível verificar as permissões. Verifique a ligação e tente novamente.",
};

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { motivo?: AuthReason } => {
    const m = search["motivo"];
    return m === "entrar" || m === "expirada" || m === "permissao" || m === "erro" ? { motivo: m } : {};
  },
  head: () => ({
    meta: [
      { title: "Entrar — Solar Eclipse" },
      { name: "description", content: "Acesso reservado à equipa Solar Eclipse." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { motivo } = Route.useSearch();
  const { user, isAdmin, loading } = useIsAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin", replace: true });
  }, [loading, user, isAdmin, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth` },
          });
    setBusy(false);
    if (result.error) {
      const msg = result.error.message;
      toast.error(
        /invalid login credentials/i.test(msg)
          ? "Email ou palavra-passe incorretos."
          : /email not confirmed/i.test(msg)
            ? "Confirme o seu email antes de entrar."
            : msg,
      );
      return;
    }
    toast.success(mode === "login" ? "Sessão iniciada" : "Conta criada");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Sessão terminada");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7]" aria-busy="true">
        <p role="status" className="text-sm text-black/50">A verificar sessão…</p>
      </main>
    );
  }

  if (!loading && user && !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-5">
        <div className="w-full max-w-md rounded-[30px] border border-black/[0.07] bg-white p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,.08)]">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-black text-white">
            <LockKeyhole className="size-4" />
          </div>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Solar Eclipse</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Acesso limitado.</h1>
          <p className="mt-4 text-sm leading-6 text-black/50">
            Esta conta está autenticada, mas não tem o papel de administrador.
          </p>
          <div className="mt-7 flex gap-2">
            <Button variant="outline" className="flex-1 rounded-full" onClick={handleSignOut}>Terminar sessão</Button>
            <Button asChild className="flex-1 rounded-full bg-black text-white hover:bg-black/85"><Link to="/">Início</Link></Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="solar-auth-page grid min-h-screen bg-[#f5f5f7] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-black lg:block">
        <img src={IMAGE} alt="" className="absolute inset-0 size-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">Solar Eclipse</p>
          <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[.95] tracking-[-0.06em]">
            Crie experiências que começam antes do dia.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-6 text-white/55">
            Um workspace para criar, personalizar e entregar convites digitais premium.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-[-0.02em]">
            <EclipseMark className="size-7" />
            Solar Eclipse
          </Link>

          <div className="mt-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Área interna</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              {mode === "login" ? "Bem-vindo." : "Criar acesso."}
            </h1>
            <p className="mt-4 text-sm leading-6 text-black/50">
              {mode === "login" ? "Entre para gerir os seus eventos." : "Crie a conta que será usada para entrar no workspace."}
            </p>
          </div>

          {motivo && (
            <p role="alert" className="mt-8 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/70">
              {REASON_TEXT[motivo]}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-black/60">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl border-black/10 bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-black/60">Palavra-passe</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl border-black/10 bg-white" />
            </div>
            <Button type="submit" className="h-12 w-full rounded-xl bg-black text-white hover:bg-black/85" disabled={busy}>
              {busy ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>

          <button
            type="button"
            className="mt-6 text-xs text-black/40 underline-offset-4 hover:text-black hover:underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Ainda não tenho acesso" : "Já tenho uma conta"}
          </button>
        </div>
      </div>
    </main>
  );
}
