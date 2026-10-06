const WHATSAPP_PHONE = "258847404160";

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return WHATSAPP_PHONE;
  if (digits.startsWith("258")) return digits;
  if (digits.startsWith("0")) return "258" + digits.slice(1);
  return "258" + digits;
}

export function whatsappUrl(message: string, phone = WHATSAPP_PHONE) {
  const target = normalizePhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${target}?text=${encoded}`;
}

/**
 * Opens WhatsApp reliably across desktop and mobile.
 * On mobile we try the installed app first; if the browser cannot handle
 * the custom protocol, we fall back to the official wa.me link.
 */
export function openWhatsApp(message: string, phone = WHATSAPP_PHONE) {
  const target = normalizePhone(phone);
  const encoded = encodeURIComponent(message);
  const webUrl = `https://wa.me/${target}?text=${encoded}`;
  const appUrl = `whatsapp://send?phone=${target}&text=${encoded}`;

  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    let fallback: number | undefined;
    const onVisibilityChange = () => {
      if (document.hidden && fallback) window.clearTimeout(fallback);
    };
    document.addEventListener("visibilitychange", onVisibilityChange, { once: true });
    window.location.href = appUrl;
    fallback = window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.location.href = webUrl;
    }, 1200);
    return;
  }

  window.open(webUrl, "_blank", "noopener,noreferrer");
}
