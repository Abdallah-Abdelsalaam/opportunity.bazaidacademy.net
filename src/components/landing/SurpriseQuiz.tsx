import { useEffect, useState } from "react";
import { Confetti } from "./Confetti";
import { useUiSound } from "@/lib/use-ui-sound";

const OPTIONS = ["ص × س", "س + ص", "٢س = ٢ص", "س + ٢ص"];
const CORRECT = 1;

export function SurpriseQuiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const sound = useUiSound();

  useEffect(() => {
    if (open) {
      setPicked(null);
      setCelebrate(false);
      sound.play("pop");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === CORRECT) {
      setCelebrate(true);
      sound.play("celebrate");
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([12, 40, 18]);
      window.setTimeout(() => setCelebrate(false), 2600);
    } else {
      sound.play("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="سؤال مفاجئ"
      onClick={onClose}
    >
      <div
        className="surface-card relative w-full max-w-lg overflow-hidden rounded-3xl p-6 animate-scale-in sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {celebrate && <Confetti />}
        <div className="relative flex items-start justify-between gap-4">
          <span className="rounded-full bg-gold px-4 py-1 text-sm font-bold text-gold-foreground">
            سؤال مفاجئ ⚡
          </span>
          <button
            onClick={() => {
              sound.play("click");
              onClose();
            }}
            aria-label="إغلاق"
            className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            ✕
          </button>
        </div>

        <p className="relative mt-5 text-lg font-bold leading-relaxed">
          إذا كان <span className="gold-gradient-text inline-block">(س)</span> عددًا موجبًا{" "}
          <span className="gold-gradient-text">زوجيًا</span> و{" "}
          <span className="gold-gradient-text inline-block">(ص)</span> عددًا موجبًا{" "}
          <span className="gold-gradient-text">فرديًا</span>، فأي مما يلي{" "}
          <span className="gold-gradient-text">يجب أن يكون فرديًا؟</span>
        </p>

        <div className="relative mt-5 grid grid-cols-2 gap-3">
          {OPTIONS.map((opt, i) => {
            const isPicked = picked === i;
            const state =
              picked === null
                ? "border-border bg-surface-2/60 hover:border-primary hover:scale-[1.03]"
                : i === CORRECT
                  ? "border-gold bg-gold/15 text-gold"
                  : isPicked
                    ? "border-destructive bg-destructive/15 text-destructive"
                    : "border-border bg-surface-2/40 opacity-60";
            const anim =
              picked !== null && i === CORRECT
                ? "answer-pop"
                : isPicked && i !== CORRECT
                  ? "answer-shake"
                  : "";
            return (
              <button
                key={opt}
                disabled={picked !== null}
                onMouseEnter={() => picked === null && sound.play("hover")}
                onClick={() => choose(i)}
                className={`flex items-center justify-center rounded-2xl border px-4 py-3 text-lg font-bold transition-all ${state} ${anim}`}
              >
                <span dir="ltr">{opt}</span>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <p className="relative mt-5 text-sm leading-relaxed text-muted-foreground animate-fade-in">
            {picked === CORRECT ? "إجابة صحيحة! 🎯 " : "الإجابة الصحيحة: س + ص. "}
            زوجي + فردي = فردي دايمًا — وهذا بالضبط نوع الأسئلة اللي بنحلها معاك خطوة بخطوة في
            الدورة.
          </p>
        )}

        <button
          onClick={() => {
            sound.play("click");
            onClose();
          }}
          className="relative mt-6 w-full rounded-2xl bg-[image:var(--gradient-brand)] px-6 py-3 font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]"
        >
          كمّل تصفح النبذات
        </button>
      </div>
    </div>
  );
}
