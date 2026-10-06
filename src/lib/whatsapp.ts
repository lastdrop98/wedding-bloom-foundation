const WHATSAPP_PHONE = "258847404160";

export function whatsappUrl(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}

/**
 * Opens the WhatsApp app when it is installed, then falls back to the
 * official wa.me universal link.
 */
export function openWhatsApp(message: string, phone = WHATSAPP_PHONE) {
  const encoded = encodeURIComponent(message);
  const webUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
  const appUrl = `whatsapp://send?phone=${WHATSAPP_PHONE}&text=${encoded}`;

  function onVisibilityChange() {
    if (document.hidden) window.clearTimeout(fallback);
  }

  document.addEventListener("visibilitychange", onVisibilityChange, { once: true });
  window.location.href = appUrl;

  const fallback = window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.location.href = webUrl;
  }, 900);
}
