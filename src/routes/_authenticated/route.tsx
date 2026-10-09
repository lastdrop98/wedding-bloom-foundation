import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const hadSession = Boolean(sessionData.session);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { motivo: hadSession ? "expirada" : "entrar" } });
    }
    const { data: role, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (roleError) throw redirect({ to: "/auth", search: { motivo: "erro" } });
    if (!role) throw redirect({ to: "/auth", search: { motivo: "permissao" } });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
