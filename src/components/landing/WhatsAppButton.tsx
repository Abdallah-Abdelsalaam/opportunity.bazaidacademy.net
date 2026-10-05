import { useUiSound } from "@/lib/use-ui-sound";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=966560579292&text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%F0%9F%91%8B%F0%9F%8F%BB%D8%A7%D9%86%D8%A7%20%D9%88%D8%B5%D9%84%D8%AA%D9%86%D9%8A%20%D8%B5%D9%81%D8%AD%D8%AA%D9%83%D9%85%D8%8C%20%D9%88%20%D8%AD%D8%A7%D8%A8%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%B1%20%D8%B9%D9%86%20%D8%AF%D9%88%D8%B1%D8%A7%D8%AA%20%D8%A7%D9%83%D8%A7%D8%AF%D9%8A%D9%85%D9%8A%D8%A9%20%D8%A8%D8%A7%D8%B2%D9%8A%D8%AF";

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.21 0C5.52 0 .003 5.517.003 12.21c0 2.146.56 4.236 1.62 6.078L0 24l5.894-1.55a12.166 12.166 0 005.316 1.23c6.688 0 12.205-5.517 12.205-12.21 0-3.26-1.27-6.327-3.59-8.645" />
    </svg>
  );
}

export function WhatsAppFloatingButton() {
  const sound = useUiSound();
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      onClick={() => sound.play("click")}
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110 active:scale-95"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

export function WhatsAppCompactLink({ className = "" }: { className?: string }) {
  const sound = useUiSound();
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      onClick={() => sound.play("click")}
      className={`inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 ${className}`}
    >
      <WhatsAppIcon className="h-3.5 w-3.5" />
      واتساب
    </a>
  );
}
