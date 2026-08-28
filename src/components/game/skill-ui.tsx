"use client";

import type { ReactNode } from "react";
import {
  Fish,
  Pickaxe,
  Hammer,
  TreeDeciduous,
  UtensilsCrossed,
  Sparkles,
  Package,
  ArrowRight,
  MapPin,
  Lock,
} from "lucide-react";
import { ITEMS } from "@/content";
import {
  formatSkill,
  skillLevelFromXp,
  SKILL_XP_PER_LEVEL,
  rarityClass,
  type SkillId,
} from "@/lib/game";
import type { SkillActivityDef, RecipeDef } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const SKILL_THEME: Record<
  SkillId,
  {
    label: string;
    icon: typeof Fish;
    ring: string;
    glow: string;
    border: string;
    badge: string;
    gradient: string;
  }
> = {
  fishing: {
    label: "Fishing",
    icon: Fish,
    ring: "ring-sky-400/35",
    glow: "shadow-[0_0_24px_oklch(0.65_0.12_230/_0.22)]",
    border: "border-sky-700/45 hover:border-sky-500/55",
    badge: "bg-sky-950/50 text-sky-200 border-sky-700/40",
    gradient: "from-sky-500/15 via-transparent to-transparent",
  },
  mining: {
    label: "Mining",
    icon: Pickaxe,
    ring: "ring-stone-400/35",
    glow: "shadow-[0_0_24px_oklch(0.55_0.04_70/_0.28)]",
    border: "border-stone-600/50 hover:border-stone-400/55",
    badge: "bg-stone-900/60 text-stone-200 border-stone-600/45",
    gradient: "from-stone-400/12 via-transparent to-transparent",
  },
  smithing: {
    label: "Smithing",
    icon: Hammer,
    ring: "ring-orange-400/35",
    glow: "shadow-[0_0_28px_oklch(0.72_0.14_55/_0.25)]",
    border: "border-orange-800/45 hover:border-orange-500/55",
    badge: "bg-orange-950/45 text-orange-200 border-orange-800/40",
    gradient: "from-orange-500/18 via-transparent to-transparent",
  },
  woodcutting: {
    label: "Woodcutting",
    icon: TreeDeciduous,
    ring: "ring-emerald-400/30",
    glow: "shadow-[0_0_24px_oklch(0.65_0.12_150/_0.2)]",
    border: "border-emerald-800/45 hover:border-emerald-500/50",
    badge: "bg-emerald-950/45 text-emerald-200 border-emerald-800/40",
    gradient: "from-emerald-500/15 via-transparent to-transparent",
  },
  cooking: {
    label: "Cooking",
    icon: UtensilsCrossed,
    ring: "ring-amber-400/35",
    glow: "shadow-[0_0_24px_oklch(0.82_0.12_85/_0.2)]",
    border: "border-amber-800/45 hover:border-amber-500/50",
    badge: "bg-amber-950/40 text-amber-200 border-amber-800/40",
    gradient: "from-amber-400/15 via-transparent to-transparent",
  },
};

export function SkillIconBadge({
  skill,
  size = "md",
  className,
}: {
  skill: SkillId;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const theme = SKILL_THEME[skill];
  const Icon = theme.icon;
  const sizes = {
    sm: "size-8 [&_svg]:size-3.5",
    md: "size-10 [&_svg]:size-4",
    lg: "size-12 [&_svg]:size-5",
  };
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border bg-card/60 ring-1 backdrop-blur-sm",
        theme.ring,
        theme.border,
        sizes[size],
        className,
      )}
      aria-hidden
    >
      <Icon className="text-amber-100/90" strokeWidth={1.75} />
    </span>
  );
}

export function SkillXpBar({
  xp,
  className,
  skill,
}: {
  xp: number;
  className?: string;
  skill?: SkillId;
}) {
  const level = skillLevelFromXp(xp);
  const nextAt = level * SKILL_XP_PER_LEVEL;
  const prevAt = (level - 1) * SKILL_XP_PER_LEVEL;
  const span = Math.max(1, nextAt - prevAt);
  const pct = Math.min(100, Math.round(((xp - prevAt) / span) * 100));
  const theme = skill ? SKILL_THEME[skill] : null;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>Lv {level}</span>
        <span>{pct}% to Lv {Math.min(99, level + 1)}</span>
      </div>
      <div className="skill-xp-track h-1.5 overflow-hidden rounded-full bg-muted/50">
        <div
          className={cn(
            "skill-xp-fill h-full rounded-full transition-all duration-500",
            theme ? "bg-primary/80" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SkillSectionHeader({
  skill,
  subtitle,
}: {
  skill: SkillId;
  subtitle?: string;
}) {
  const theme = SKILL_THEME[skill];
  return (
    <div className="flex items-center gap-3">
      <SkillIconBadge skill={skill} />
      <div className="min-w-0">
        <p className="font-heading text-sm font-semibold text-amber-50/95">
          {theme.label}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function SkillsMapHeader() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-amber-800/30 bg-gradient-to-r from-amber-500/10 via-transparent to-violet-500/5 px-3 py-2.5">
      <Sparkles className="size-4 shrink-0 text-amber-300/80" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-amber-100/95">Road skills</p>
        <p className="text-xs text-muted-foreground">
          Timed training — always succeeds, yields materials & XP
        </p>
      </div>
    </div>
  );
}

export function SkillActivityCard({
  activity,
  playerLevel,
  onStart,
}: {
  activity: SkillActivityDef;
  playerLevel: number;
  onStart: () => void;
}) {
  const theme = SKILL_THEME[activity.skill];
  const locked = playerLevel < activity.levelReq;
  const yields = activity.yields.map((y) => ({
    id: y.materialId,
    name: ITEMS[y.materialId]?.name ?? y.materialId,
    min: y.min,
    max: y.max,
  }));

  return (
    <li
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/50 p-4 backdrop-blur-sm transition duration-300",
        theme.border,
        !locked && "hover:bg-card/70",
        !locked && theme.glow,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
          theme.gradient,
        )}
        aria-hidden
      />
      <div className="relative flex gap-3">
        <SkillIconBadge skill={activity.skill} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="font-heading font-medium text-amber-50/95">
              {activity.name}
            </p>
            <Badge
              variant="outline"
              className={cn("shrink-0 border text-[10px]", theme.badge)}
            >
              {locked ? (
                <span className="flex items-center gap-1">
                  <Lock className="size-3" aria-hidden />
                  Req. {activity.levelReq}
                </span>
              ) : (
                <>Lv {playerLevel}</>
              )}
            </Badge>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {activity.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {yields.map((y) => (
              <span
                key={y.id}
                className="rounded-full border border-border/50 bg-background/40 px-2 py-0.5 text-[11px] text-stone-300"
              >
                {y.name} {y.min}–{y.max}
              </span>
            ))}
            {activity.rareMaterialId && (
              <span className="rounded-full border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[11px] text-amber-200/90">
                Rare: {ITEMS[activity.rareMaterialId]?.name ?? "—"}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            +{activity.xp} XP · no failure roll
          </p>
          <Button
            type="button"
            size="sm"
            disabled={locked}
            className="mt-3 rounded-full px-4"
            onClick={onStart}
          >
            {locked
              ? `Train ${theme.label} to ${activity.levelReq}`
              : "Begin training"}
            {!locked && (
              <ArrowRight
                className="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}

export function RecipeCard({
  recipe,
  level,
  locked,
  canCraft,
  atLocation,
  materialCounts,
  onCraft,
}: {
  recipe: RecipeDef;
  level: number;
  locked: boolean;
  canCraft: boolean;
  atLocation: boolean;
  materialCounts: Record<string, number>;
  onCraft: () => void;
}) {
  const theme = SKILL_THEME[recipe.skill];
  const disabled = locked || !canCraft || !atLocation;
  const outputLabel = recipe.outputItemId
    ? ITEMS[recipe.outputItemId]?.name
    : recipe.outputMaterialId
      ? `${recipe.outputAmount ?? 1}× ${ITEMS[recipe.outputMaterialId]?.name}`
      : "—";

  let cta = "Craft";
  if (locked) cta = `Need Lv ${recipe.levelReq}`;
  else if (!atLocation) cta = "At Stonewheel Mill";
  else if (!canCraft) cta = "Missing materials";

  return (
    <li
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card/45 p-4 backdrop-blur-sm transition",
        theme.border,
        !disabled && theme.glow,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50",
          theme.gradient,
        )}
        aria-hidden
      />
      <div className="relative flex gap-3">
        <SkillIconBadge skill={recipe.skill} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="font-medium text-amber-50/95">{recipe.name}</p>
            <div className="flex flex-wrap gap-1">
              {recipe.locationId && (
                <Badge variant="outline" className="text-[10px]">
                  <MapPin className="mr-1 size-3" aria-hidden />
                  Mill
                </Badge>
              )}
              <Badge
                variant="outline"
                className={cn("text-[10px]", theme.badge)}
              >
                Lv {level}/{recipe.levelReq}
              </Badge>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{recipe.description}</p>
          <ul className="mt-3 space-y-1">
            {recipe.inputs.map((input) => {
              const have = materialCounts[input.materialId] ?? 0;
              const ok = have >= input.amount;
              return (
                <li
                  key={input.materialId}
                  className={cn(
                    "flex items-center justify-between text-xs rounded-lg px-2 py-1",
                    ok ? "bg-emerald-950/25 text-emerald-100/90" : "bg-muted/30 text-muted-foreground",
                  )}
                >
                  <span>{ITEMS[input.materialId]?.name ?? input.materialId}</span>
                  <span className="font-medium tabular-nums">
                    {have}/{input.amount}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-amber-200/80">
            Makes: <span className="text-amber-100">{outputLabel}</span>
            {" · "}+{recipe.xp} XP
          </p>
          <Button
            type="button"
            size="sm"
            disabled={disabled}
            className="mt-3 rounded-full"
            onClick={onCraft}
          >
            {cta}
          </Button>
        </div>
      </div>
    </li>
  );
}

export function MaterialTile({
  id,
  count,
}: {
  id: string;
  count: number;
}) {
  const def = ITEMS[id];
  if (!def) return null;
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 p-3 backdrop-blur-sm transition hover:border-amber-800/35",
        rarityClass(def.rarity),
      )}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/30"
        aria-hidden
      >
        <Package className="size-4 text-muted-foreground" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-tight">{def.name}</p>
        <p className="text-xs text-muted-foreground">{def.sellValue}g each</p>
      </div>
      <Badge
        variant="secondary"
        className="tabular-nums font-semibold shadow-inner"
      >
        {count}
      </Badge>
    </li>
  );
}

export function SkillOverviewTile({
  skill,
  xp,
}: {
  skill: SkillId;
  xp: number;
}) {
  const theme = SKILL_THEME[skill];
  const level = skillLevelFromXp(xp);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card/40 p-3 backdrop-blur-sm transition hover:bg-card/55",
        theme.border,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-40",
          theme.gradient,
        )}
        aria-hidden
      />
      <div className="relative flex items-start gap-2.5">
        <SkillIconBadge skill={skill} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {theme.label}
          </p>
          <p className="font-heading text-xl font-semibold tabular-nums text-amber-50/95">
            {level}
          </p>
          <SkillXpBar xp={xp} skill={skill} className="mt-2" />
          <p className="mt-1 text-[10px] text-muted-foreground tabular-nums">
            {xp} XP total
          </p>
        </div>
      </div>
    </div>
  );
}

export function SkillTrainingCard({
  title,
  skill,
  beat,
  pct,
  remaining,
  formatRemaining,
}: {
  title: string;
  skill: SkillId;
  beat: string;
  pct: number;
  remaining: number;
  formatRemaining: (ms: number) => string;
}) {
  const theme = SKILL_THEME[skill];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-md",
        theme.border,
        theme.glow,
      )}
    >
      <div
        className={cn(
          "border-b border-border/40 bg-gradient-to-r px-4 py-3",
          theme.gradient,
        )}
      >
        <div className="flex items-center gap-3">
          <SkillIconBadge skill={skill} size="sm" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Training
            </p>
            <p className="font-heading text-sm font-semibold text-amber-50/95">
              {title}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <p
          className="min-h-10 text-sm leading-relaxed text-amber-100/90 italic"
          aria-live="polite"
        >
          {beat}
        </p>
        <Progress value={pct} className="h-2" aria-label="Training progress" />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {formatRemaining(remaining)} remaining · {pct}%
        </p>
      </div>
    </div>
  );
}

export function SkillRewardBlock({
  skillId,
  skillXp,
  materials,
  item,
}: {
  skillId?: SkillId;
  skillXp?: number;
  materials?: Record<string, number>;
  item?: { defId: string; power: number; legendary?: boolean };
}) {
  const theme = skillId ? SKILL_THEME[skillId] : null;

  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border border-emerald-800/35 bg-emerald-950/20 p-3",
        theme?.border,
      )}
    >
      {skillId && skillXp && theme && (
        <div className="flex items-center gap-2">
          <SkillIconBadge skill={skillId} size="sm" />
          <p className="text-sm font-medium text-emerald-200">
            {theme.label}{" "}
            <span className="text-emerald-100">+{skillXp} XP</span>
          </p>
        </div>
      )}
      {materials && Object.keys(materials).length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {Object.entries(materials).map(([id, amount]) => (
            <li
              key={id}
              className="rounded-full border border-border/50 bg-background/50 px-3 py-1 text-xs text-stone-200"
            >
              {ITEMS[id]?.name ?? id}{" "}
              <span className="font-semibold text-amber-100">×{amount}</span>
            </li>
          ))}
        </ul>
      )}
      {item && (
        <p className={cn("text-sm", rarityClass(ITEMS[item.defId]?.rarity ?? "common"))}>
          {item.legendary ? "Legendary: " : "Crafted: "}
          {ITEMS[item.defId]?.name}
          {item.power > 0 ? ` +${item.power}` : ""}
        </p>
      )}
    </div>
  );
}

export function CraftSkillsIntro({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-800/25 bg-gradient-to-br from-amber-500/8 via-card/40 to-violet-900/10 p-4 backdrop-blur-sm">
      <p className="font-heading text-sm font-semibold text-amber-100/95">
        Artisan work
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {children ??
          "Materials from the road feed recipes here. Smith at Stonewheel Mill; cook anywhere with a full sack."}
      </p>
    </div>
  );
}
