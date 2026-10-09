import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load(currentUser: User | null) {
      if (!currentUser) {
        if (!active) return;
        setUser(null);
        setIsAdmin(false);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", currentUser.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!active) return;
        setUser(currentUser);

        if (roleError) {
          // A failed role lookup is not the same as a confirmed non-admin account.
          setIsAdmin(false);
          setError("Não foi possível confirmar as permissões de administrador. Tente novamente.");
          return;
        }

        setIsAdmin(Boolean(data));
      } catch {
        if (!active) return;
        setUser(currentUser);
        setIsAdmin(false);
        setError("Não foi possível confirmar as permissões de administrador. Tente novamente.");
      } finally {
        if (active) setLoading(false);
      }
    }

    supabase.auth
      .getUser()
      .then(({ data, error: authError }) => {
        if (authError) {
          if (!active) return;
          setUser(null);
          setIsAdmin(false);
          setError("Não foi possível verificar a sessão. Inicie sessão novamente.");
          setLoading(false);
          return;
        }
        return load(data.user ?? null);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setIsAdmin(false);
        setError("Não foi possível verificar a sessão. Inicie sessão novamente.");
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load(session?.user ?? null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading, error };
}
