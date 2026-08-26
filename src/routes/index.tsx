import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solar Eclipse — Convites de Casamento Digitais" },
      {
        name: "description",
        content:
          "Solar Eclipse cria convites de casamento digitais elegantes, com confirmação de presença, galeria e programa do dia.",
      },
      { property: "og:title", content: "Solar Eclipse — Convites de Casamento Digitais" },
      {
        property: "og:description",
        content: "Convites de casamento digitais elegantes, um para cada casal.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Convites digitais</p>
      <h1 className="mt-4 text-5xl font-light tracking-wide text-foreground">Solar Eclipse</h1>
      <span className="gold-rule mt-6" />
      <p className="mt-6 max-w-md text-muted-foreground">
        Cada casamento tem o seu endereço próprio. Peça o link ao casal para abrir o convite.
      </p>
      <Link
        to="/admin"
        className="mt-10 rounded-md border border-primary px-6 py-2 text-sm tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        Área reservada
      </Link>
    </main>
  );
}
