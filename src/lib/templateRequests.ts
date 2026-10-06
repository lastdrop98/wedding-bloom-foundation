import { looseDb } from "@/lib/event";

export type TemplateRequest = {
  id: string;
  template_value: string;
  template_label: string;
  couple_name: string;
  phone: string;
  wedding_date: string | null;
  message: string | null;
  status: "new" | "in_progress" | "completed" | "cancelled";
  created_at: string;
};

const LOCAL_KEY = "solar-eclipse-template-requests";

function localRead(): TemplateRequest[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(LOCAL_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function localWrite(items: TemplateRequest[]) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export async function createTemplateRequest(input: {
  template_value: string;
  template_label: string;
  couple_name: string;
  phone: string;
  wedding_date?: string | null;
  message?: string | null;
}) {
  const payload = {
    template_value: input.template_value,
    template_label: input.template_label,
    couple_name: input.couple_name,
    phone: input.phone,
    wedding_date: input.wedding_date || null,
    message: input.message || null,
    status: "new",
  };

  const { data, error } = await looseDb
    .from("template_requests")
    .insert(payload)
    .select("*")
    .single();

  if (!error && data) return data as TemplateRequest;

  const local: TemplateRequest = {
    id: crypto.randomUUID(),
    ...payload,
    status: "new",
    created_at: new Date().toISOString(),
  };
  localWrite([local, ...localRead()]);
  return local;
}

export async function fetchTemplateRequests() {
  const { data, error } = await looseDb
    .from("template_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const remote = error ? [] : ((data ?? []) as TemplateRequest[]);
  const local = typeof window === "undefined" ? [] : localRead();
  const seen = new Set(remote.map((item) => item.id));
  return [...remote, ...local.filter((item) => !seen.has(item.id))];
}

export async function updateTemplateRequestStatus(id: string, status: TemplateRequest["status"]) {
  const { data, error } = await looseDb
    .from("template_requests")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (!error && data) return data as TemplateRequest;

  if (typeof window !== "undefined") {
    const updated = localRead().map((item) => item.id === id ? { ...item, status } : item);
    localWrite(updated);
    return updated.find((item) => item.id === id) ?? null;
  }
  return null;
}
