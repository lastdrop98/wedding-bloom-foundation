const WHATSAPP_PHONE = "258847404160";

export function whatsappUrl(message: string) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  const url = whatsappUrl(message);
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.href = url;
  }
}
