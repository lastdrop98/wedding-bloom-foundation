import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCheckError, setAdminCheckError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load(currentUser: User | null) {
      if (!currentUser) {
        if (!active) return;
        setUser(null);
        setIsAdmin(false);
        setAdminCheckError(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", currentUser.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!active) return;
        setUser(currentUser);
        setIsAdmin(!error && Boolean(data));
        setAdminCheckError(error ? error.message : null);
      } catch (error) {
        if (!active) return;
        setUser(currentUser);
        setIsAdmin(false);
        setAdminCheckError(error instanceof Error ? error.message : "Não foi possível verificar o papel de administrador.");
      } finally {
        if (active) setLoading(false);
      }
    }

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (error) throw error;
        return load(data.user ?? null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setUser(null);
        setIsAdmin(false);
        setAdminCheckError(error instanceof Error ? error.message : "Não foi possível verificar a sessão.");
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
        setLoading(true);
        setAdminCheckError(null);
        void load(session?.user ?? null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading, adminCheckError };
}
