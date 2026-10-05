import { useEffect, useMemo, useRef, useState } from "react";
import { Download, ExternalLink, Loader2, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppCompactLink } from "@/components/landing/WhatsAppButton";

const STUDENT_KEY = "bazaid-student-info";

type StudentInfo = { name: string; phone: string };

function getStudent(): StudentInfo | null {
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentInfo;
    return parsed.name && parsed.phone ? parsed : null;
  } catch {
    return null;
  }
}

export type ModalLink = { url: string; title: string };

/** Converts share links into embeddable preview URLs when possible. */
export function toEmbedUrl(url: string): string {
  // Google Drive file: /file/d/<id>/view... -> /preview
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  // Google Docs/Slides: /d/<id>/edit... -> /preview
  const docs = url.match(/docs\.google\.com\/(presentation|document|spreadsheets)\/d\/([^/]+)/);
  if (docs) return `https://docs.google.com/${docs[1]}/d/${docs[2]}/preview`;
  return url;
}

/** Direct download URL for a file we host ourselves or a public Drive file. */
export function toDownloadUrl(url: string, _title = "ملف"): string | null {
  // Files hosted on our own site: already a direct link.
  if (url.startsWith("/") && url.toLowerCase().endsWith(".pdf")) return url;
  // Google Drive file: direct download link.
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return `https://drive.google.com/uc?export=download&id=${drive[1]}`;
  return null;
}

/** True when the download URL is same-origin (we can fetch it as a file). */
function isSameOriginDownload(url: string): boolean {
  return url.startsWith("/");
}

/** Keeps already-opened iframe URLs warm so re-opening is instant. */
const warmUrls = new Set<string>();

/**
 * Preloads the popup iframes in the background once the page is idle,
 * so links open instantly instead of waiting for the file to download.
 */
export function LinkPreloader({ links }: { links: ModalLink[] }) {
  const [warm, setWarm] = useState(false);

  useEffect(() => {
    const start = () => setWarm(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 2500);
    return () => clearTimeout(t);
  }, []);

  if (!warm) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden opacity-0">
      {links.map((l) => {
        const src = toEmbedUrl(l.url);
        warmUrls.add(src);
        return <iframe key={src} src={src} title="" loading="lazy" tabIndex={-1} className="h-px w-px" />;
      })}
    </div>
  );
}

/** Tall in-page popup that opens a link inside the landing page. */
export function LinkModal({ link, onClose }: { link: ModalLink | null; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [downloadObjectUrl, setDownloadObjectUrl] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState(false);
  const [studentSaved, setStudentSaved] = useState(() => getStudent() !== null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [formError, setFormError] = useState("");
  const pendingDownloadRef = useRef<(() => void) | null>(null);
  const loadedRef = useRef<Set<string>>(new Set());

  const previewUrl = link ? toEmbedUrl(link.url) : null;
  const downloadUrl = useMemo(
    () => (link ? toDownloadUrl(link.url, link.title) : null),
    [link],
  );

  useEffect(() => {
    setDownloadFile(null);
    setDownloadObjectUrl(null);
    setDownloadError(false);
    setShowStudentForm(false);
    setFormError("");
    // Cross-origin downloads (e.g. Drive) open directly — no blob prefetch.
    if (!downloadUrl || !link || !isSameOriginDownload(downloadUrl)) return;

    const controller = new AbortController();
    let objectUrl: string | null = null;
    void fetch(downloadUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("download failed");
        const blob = await response.blob();
        const file = new File([blob], `${link.title}.pdf`, {
          type: blob.type || "application/pdf",
        });
        objectUrl = URL.createObjectURL(file);
        setDownloadFile(file);
        setDownloadObjectUrl(objectUrl);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setDownloadError(true);
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [downloadUrl, link]);

  useEffect(() => {
    if (!link || !previewUrl) return;
    // If this URL was preloaded or opened before, the browser cache makes it instant.
    setLoading(!(warmUrls.has(previewUrl) || loadedRef.current.has(previewUrl)));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [link, previewUrl, onClose]);

  if (!link || !previewUrl) return null;

  const runDownload = (action: () => void) => {
    if (studentSaved) {
      action();
      return;
    }
    // First download only: ask for the student's info, then continue.
    pendingDownloadRef.current = action;
    setFormError("");
    setShowStudentForm(true);
  };

  const submitStudent = () => {
    const name = studentName.trim();
    const phone = studentPhone.trim().replace(/[\s-]/g, "");
    if (name.length < 2) {
      setFormError("سجل بياناتك");
      return;
    }
    if (!/^\+?\d{8,15}$/.test(phone)) {
      setFormError("اكتب رقم جوال صحيح (أرقام فقط)");
      return;
    }
    try {
      localStorage.setItem(STUDENT_KEY, JSON.stringify({ name, phone }));
    } catch {
      /* storage may be unavailable — continue anyway */
    }
    setStudentSaved(true);
    setShowStudentForm(false);
    const action = pendingDownloadRef.current;
    pendingDownloadRef.current = null;
    action?.();
  };

  const saveFile = () => {
    if (!downloadFile || !downloadObjectUrl) return;

    if (navigator.share && navigator.canShare?.({ files: [downloadFile] })) {
      void navigator.share({ files: [downloadFile], title: link.title }).catch(() => undefined);
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = downloadObjectUrl;
    anchor.download = downloadFile.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={link.title}
    >
      <div
        className="surface-card relative flex h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.75rem] border border-border shadow-[var(--shadow-glow)] sm:h-[88dvh] sm:rounded-[1.75rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 py-3 sm:px-6">
          <p className="truncate text-base font-black sm:text-lg">{link.title}</p>
          <div className="flex shrink-0 items-center gap-2">
            <WhatsAppCompactLink />
            {downloadUrl &&
              (isSameOriginDownload(downloadUrl) ? (
                <Button
                  type="button"
                  size="sm"
                  className="rounded-xl text-xs font-bold"
                  disabled={!downloadFile}
                  onClick={() => runDownload(saveFile)}
                >
                  {downloadFile ? (
                    <Download className="h-3.5 w-3.5" />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {downloadFile ? "تحميل" : downloadError ? "تعذّر التحميل" : "تجهيز…"}
                </Button>
              ) : (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (studentSaved) return;
                    e.preventDefault();
                    runDownload(() =>
                      window.open(downloadUrl, "_blank", "noopener,noreferrer"),
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Download className="h-3.5 w-3.5" />
                  تحميل
                </a>
              ))}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              فتح خارجي
            </a>
            <Button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              variant="outline"
              size="icon"
              className="rounded-xl text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="relative flex-1 bg-background">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background">
              <Loader2 className="h-9 w-9 animate-spin text-primary" />
              <p className="text-sm font-bold text-muted-foreground">جاري تحميل الملف…</p>
            </div>
          )}
          <iframe
            key={previewUrl}
            src={previewUrl}
            title={link.title}
            onLoad={() => {
              loadedRef.current.add(previewUrl);
              setLoading(false);
            }}
            className="h-full w-full bg-background"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
        </div>
        {showStudentForm && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowStudentForm(false)}
          >
            <div
              className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 text-center shadow-[var(--shadow-glow)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black">سجل بياناتك للمتابعة</h3>
              <div className="mt-5 space-y-3 text-right">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold">
                    <User className="h-4 w-4 text-primary" />
                    اسمك
                  </span>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    maxLength={100}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold outline-none transition-colors focus:border-primary"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold">
                    <Phone className="h-4 w-4 text-primary" />
                    رقم الجوال
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    dir="ltr"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitStudent()}
                    placeholder="+966 5xxxxxxxx"
                    maxLength={20}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-left text-sm font-semibold outline-none transition-colors focus:border-primary"
                  />
                </label>
              </div>
              {formError && (
                <p className="mt-3 text-sm font-bold text-destructive">{formError}</p>
              )}
              <Button
                type="button"
                onClick={submitStudent}
                className="mt-5 w-full rounded-xl py-6 text-base font-black"
              >
                <Download className="h-5 w-5" />
                حمّل الآن
              </Button>
              <button
                type="button"
                onClick={() => setShowStudentForm(false)}
                className="mt-3 inline-block rounded-full border-2 border-secondary bg-surface px-6 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                رجوع
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
