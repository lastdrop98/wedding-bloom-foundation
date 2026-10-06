const WHATSAPP_PHONE = "258847404160";

export function whatsappUrl(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}

/**
 * Opens the WhatsApp app when it is installed, then falls back to the
 * official wa.me universal link. This avoids api.whatsapp.com and avoids
 * forcing desktop users into web.whatsapp.com.
 */
export function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message);
  const webUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
  const appUrl = `whatsapp://send?phone=${WHATSAPP_PHONE}&text=${encoded}`;

  let fallback: number | undefined;
  const cancelFallback = () => {
    if (fallback) window.clearTimeout(fallback);
  };

  const onVisibilityChange = () => {
    if (document.hidden) cancelFallback();
  };

  document.addEventListener("visibilitychange", onVisibilityChange, { once: true });
  window.location.href = appUrl;

  fallback = window.setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.location.href = webUrl;
  }, 900);
}
