const WHATSAPP_PHONE = "258847404160";

/**
 * Opens a WhatsApp conversation using the wa.me deep link.
 * This avoids the embedded api.whatsapp.com endpoint that can be
 * blocked by some browsers/privacy settings.
 */
export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  const url = whatsappUrl(message);

  // Prefer the same navigation path used by mobile WhatsApp and WhatsApp Web.
  // If a popup is blocked, fall back to normal navigation.
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.assign(url);
  }
}
