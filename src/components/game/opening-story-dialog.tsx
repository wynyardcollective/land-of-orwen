"use client";

import { useState } from "react";
import {
  OPENING_MERRICK_QUOTE,
  OPENING_SECTIONS,
  OPENING_TITLE,
} from "@/content/opening";
import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function OpeningStoryDialog() {
  const { state, ready, dismissOpening } = useGame();
  const [step, setStep] = useState(0);

  const shouldShow =
    ready &&
    !state.storyFlags.includes("opening_seen") &&
    state.completedQuests.length === 0 &&
    (state.completedEncounters ?? []).length === 0 &&
    state.records.questsCompleted === 0;

  if (!shouldShow) return null;

  const section = OPENING_SECTIONS[step];
  const isLast = step >= OPENING_SECTIONS.length - 1;

  function finish() {
    dismissOpening();
    setStep(0);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) finish();
      }}
    >
      <DialogContent
        className="max-h-[85dvh] overflow-y-auto sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-amber-100">{OPENING_TITLE}</DialogTitle>
          <DialogDescription>
            Part {step + 1} of {OPENING_SECTIONS.length} · {section.heading}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {section.paragraphs.map((para) => (
            <p key={para}>{para}</p>
          ))}
          {isLast && (
            <blockquote className="rounded-lg border border-amber-900/40 bg-muted/30 p-3 text-amber-100/90 italic">
              &ldquo;{OPENING_MERRICK_QUOTE}&rdquo;
              <footer className="mt-2 text-xs not-italic text-muted-foreground">
                — Old Merrick, orchard keeper
              </footer>
            </blockquote>
          )}
        </div>

        <div className="flex justify-center gap-1.5 pt-1" aria-hidden>
          {OPENING_SECTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i === step ? "bg-amber-200/80" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {step > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
          )}
          {isLast ? (
            <Button type="button" onClick={finish}>
              Begin your journey
            </Button>
          ) : (
            <Button type="button" onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
