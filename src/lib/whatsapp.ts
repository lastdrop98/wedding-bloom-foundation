const WHATSAPP_PHONE = "258847404160";

/**
 * Builds a WhatsApp URL without using api.whatsapp.com.
 * Desktop browsers go directly to WhatsApp Web; mobile browsers use wa.me.
 */
export function whatsappUrl(message: string) {
  const encoded = encodeURIComponent(message);
  if (typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
  }
  return `https://web.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encoded}`;
}

export function openWhatsApp(message: string) {
  const url = whatsappUrl(message);
  // Navigate directly from the user's click. This avoids popup blockers and
  // prevents the browser from getting stuck on api.whatsapp.com.
  window.location.href = url;
}
