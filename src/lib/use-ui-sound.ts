import { useCallback, useEffect, useState } from "react";

type Tone = "click" | "hover" | "pop" | "success" | "error" | "celebrate";

const TONES: Record<Tone, { freq: number; to: number; dur: number; gain: number }> = {
  click: { freq: 520, to: 880, dur: 0.18, gain: 0.14 },
  hover: { freq: 420, to: 540, dur: 0.09, gain: 0.05 },
  pop: { freq: 300, to: 720, dur: 0.28, gain: 0.16 },
  success: { freq: 660, to: 1180, dur: 0.22, gain: 0.16 },
  error: { freq: 320, to: 140, dur: 0.3, gain: 0.14 },
  celebrate: { freq: 523, to: 1046, dur: 0.25, gain: 0.15 },
};

// ── Shared AudioContext (module-level) ──────────────────────────────────────
// متصفحات الموبايل (خصوصًا iOS Safari) توقف الصوت لحد أول لمسة من المستخدم،
// عشان كده بنستخدم AudioContext واحد مشترك ونفتحه من أول pointerdown/touchstart.
let sharedCtx: AudioContext | null = null;
let unlockBound = false;

function getSharedCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedCtx) sharedCtx = new Ctor();
  return sharedCtx;
}

/** يربط مستمعات اللمس/النقر مرة واحدة لفتح الصوت من أول تفاعل. */
function bindUnlock() {
  if (unlockBound || typeof window === "undefined") return;
  unlockBound = true;

  const unlock = () => {
    const ctx = getSharedCtx();
    if (ctx && ctx.state !== "running") void ctx.resume();
  };

  // capture: true عشان تشتغل قبل أي handler تاني، ومش once عشان لو
  // iOS رفض أول مرة نحاول تاني مع اللمسة اللي بعدها
  const opts: AddEventListenerOptions = { capture: true, passive: true };
  window.addEventListener("pointerdown", unlock, opts);
  window.addEventListener("touchstart", unlock, opts);
  window.addEventListener("click", unlock, opts);
  window.addEventListener("touchend", unlock, opts);
}

function blip(
  ctx: AudioContext,
  at: number,
  freq: number,
  to: number,
  dur: number,
  gain: number,
  type: OscillatorType = "sine",
) {
  const osc = ctx.createOscillator();
  const vol = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), at + dur);
  vol.gain.setValueAtTime(0.0001, at);
  vol.gain.exponentialRampToValueAtTime(gain, at + 0.015);
  vol.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(vol).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function scheduleTone(ctx: AudioContext, tone: Tone) {
  const t = ctx.currentTime;

  if (tone === "celebrate") {
    // صعود نغمي احتفالي
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      blip(ctx, t + i * 0.085, f, f * 1.02, 0.3, 0.13, "triangle");
    });
    return;
  }
  if (tone === "success") {
    [659.25, 987.77].forEach((f, i) => blip(ctx, t + i * 0.1, f, f * 1.05, 0.22, 0.15, "triangle"));
    return;
  }

  const { freq, to, dur, gain } = TONES[tone];
  blip(ctx, t, freq, to, dur, gain, tone === "error" ? "sawtooth" : "sine");
}

/** Lightweight WebAudio UI sounds — no assets, gesture-driven, mobile-safe. */
export function useUiSound() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("bazaid-sound");
    if (saved === "off") setEnabled(false);
    bindUnlock();
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      window.localStorage.setItem("bazaid-sound", prev ? "off" : "on");
      return !prev;
    });
  }, []);

  const play = useCallback(
    (tone: Tone = "click") => {
      if (!enabled) return;
      try {
        bindUnlock();
        const ctx = getSharedCtx();
        if (!ctx) return;
        if (ctx.state === "running") {
          scheduleTone(ctx, tone);
        } else {
          // على الموبايل الـ context بيكون suspended — نستنى الـ resume جوه
          // نفس حدث اللمس/النقر ونشتغل الصوت أول ما يتاح
          void ctx.resume().then(() => {
            if (ctx.state === "running") scheduleTone(ctx, tone);
          });
        }
      } catch {
        /* ignore */
      }
    },
    [enabled],
  );

  return { enabled, toggle, play };
}
