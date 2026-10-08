import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug")({
  component: () => <Outlet />,
  errorComponent: InviteRouteError,
});


function InviteRouteError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-6 text-center text-[#1d1d1f]">
      <div className="max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#b08b3e]">Solar Eclipse</p>
        <h1 className="mt-4 text-3xl font-light tracking-tight">Esta página não carregou.</h1>
        <p className="mt-3 text-sm leading-6 text-black/50">O convite encontrou um erro temporário. Tente novamente ou volte ao início.</p>
        <div className="mt-7 flex justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="rounded-full border-2 border-black bg-black px-5 py-3 text-xs font-medium text-white">Tentar novamente</button>
          <a href="/" className="rounded-full border-2 border-black/15 bg-white px-5 py-3 text-xs font-medium">Início</a>
        </div>
      </div>
    </main>
  );
}
