import type { ReactNode } from "react";

import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  children: ReactNode;
  align?: "center" | "start";
};

/** Big section heading wrapped in a branded shape. */
export function SectionTitle({ eyebrow, children }: Props) {
  return (
    <div className="w-full min-w-0 text-center">
      {eyebrow && (
        <Reveal>
          <span className="inline-block rounded-full border border-accent/50 bg-accent/10 px-5 py-2 text-sm font-black text-accent">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={120}>
        <div className="title-shape mt-5 block w-full max-w-full px-4 py-5 sm:inline-block sm:w-auto sm:px-14 sm:py-8">
          <h2 className="arabic-title-safe max-w-full py-1 text-center text-[2rem] leading-[1.8] font-black text-foreground [overflow-wrap:anywhere] sm:text-5xl sm:leading-[1.9] lg:text-6xl">
            {children}
          </h2>
        </div>
      </Reveal>
    </div>
  );
}
