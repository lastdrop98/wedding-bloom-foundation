import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { FlourishFrame } from "@/components/invite/Flourish";
import { Ornament } from "@/components/invite/Ornament";
import { Reveal } from "@/components/invite/Reveal";
import { useIsAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar — Solar Eclipse" },
      { name: "description", content: "Acesso reservado à equipa Solar Eclipse." },
      { property: "og:title", content: "Entrar — Solar Eclipse" },
      { property: "og:description", content: "Acesso reservado à equipa Solar Eclipse." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
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
    const fn =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth` },
          });
    const { error } = await fn;
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(mode === "login" ? "Sessão iniciada" : "Conta criada");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Sessão terminada");
  }

  if (!loading && user && !isAdmin) {
    return (
      <main className="section-dark eclipse-bg relative flex min-h-screen flex-col justify-center overflow-hidden px-6 text-center">
        <FlourishFrame size={110} />
        <Reveal className="relative mx-auto w-full max-w-md">
          <p className="eyebrow text-cream/70">Solar Eclipse</p>
          <h1 className="mt-4 text-3xl font-light text-cream">Sem permissões</h1>
          <Ornament className="mt-6" />
          <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground">
            A sua conta ({user.email}) não tem permissões de administrador. Peça a um administrador
            para lhe atribuir o papel <span className="text-foreground">admin</span> na tabela{" "}
            <span className="text-foreground">user_roles</span>, associando o seu ID de utilizador.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">O seu ID: {user.id}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button variant="outline" onClick={handleSignOut}>
              Terminar sessão
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">Início</Link>
            </Button>
          </div>
        </Reveal>
      </main>
    );
  }

  return (
    <main className="section-dark eclipse-bg relative flex min-h-screen flex-col justify-center overflow-hidden px-6">
      <FlourishFrame size={110} />
      <Reveal className="relative mx-auto w-full max-w-sm">
        <div className="text-center">
          <p className="eyebrow text-cream/70">Solar Eclipse</p>
          <h1 className="mt-3 text-3xl font-light text-cream">Área reservada</h1>
          <Ornament className="mt-5" />
        </div>

        <form onSubmit={handleSubmit} className="card-elegant mt-10 space-y-4 p-7">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-6 w-full text-center font-sans text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Não tenho conta — criar conta" : "Já tenho conta — entrar"}
        </button>
      </Reveal>
    </main>
  );
}
