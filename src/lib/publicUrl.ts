/**
 * Canonical public base URL for invitations shared outside the admin workspace.
 * Set VITE_PUBLIC_SITE_URL to the verified custom domain when one is configured.
 */
const DEFAULT_PUBLIC_SITE_URL =
  "https://wedding-bloom-foundation-git-main-sheltonbrjr-8622s-projects.vercel.app";

export function getPublicSiteUrl() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    const isWorkspacePreview =
      hostname.includes("lovable.dev") ||
      hostname.includes("lovableproject.com") ||
      hostname.includes("id-preview") ||
      hostname.includes("preview-");

    if (!isWorkspacePreview && !hostname.endsWith(".lovable.app")) {
      return window.location.origin;
    }
  }

  return DEFAULT_PUBLIC_SITE_URL;
}
