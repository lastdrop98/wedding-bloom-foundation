import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AdminCheckError = {
  message: string;
};

export function useIsAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AdminCheckError | null>(null);

  useEffect(() => {
    let active = true;
    let requestId = 0;

    async function load(currentUser: User | null) {
      const currentRequest = ++requestId;
      if (!active) return;

      setLoading(true);
      setError(null);

      if (!currentUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", currentUser.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!active || currentRequest !== requestId) return;

        setUser(currentUser);
        if (roleError) {
          // Fail closed: a role lookup failure must never grant admin access.
          setIsAdmin(false);
          setError({ message: "Não foi possível verificar as permissões de administrador." });
        } else {
          setIsAdmin(Boolean(data));
        }
      } catch {
        if (!active || currentRequest !== requestId) return;
        setUser(currentUser);
        setIsAdmin(false);
        setError({ message: "Ocorreu um erro ao verificar as permissões de administrador." });
      } finally {
        if (active && currentRequest === requestId) setLoading(false);
      }
    }

    void supabase.auth.getUser()
      .then(({ data, error: authError }) => {
        if (authError) {
          if (!active) return;
          setUser(null);
          setIsAdmin(false);
          setError({ message: "Não foi possível validar a sessão atual." });
          setLoading(false);
          return;
        }
        return load(data.user ?? null);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setIsAdmin(false);
        setError({ message: "Não foi possível validar a sessão atual." });
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED" ||
        event === "TOKEN_REFRESHED"
      ) {
        void load(session?.user ?? null);
      }
    });

    return () => {
      active = false;
      requestId += 1;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading, error };
}
