import type { QuestStat } from "@/lib/game/types";
import { LOCATION_MAP } from "./locations";
import { QUESTS } from "./quests";

export interface LocationUnlockInfo {
  questId: string;
  questName: string;
  questDescription: string;
  questLocationId: string;
  questLocationName: string;
  level: number;
  stat: QuestStat;
  rumor: boolean;
}

/** Quest that opens a locked location when completed successfully. */
export function getLocationUnlockInfo(
  locationId: string,
): LocationUnlockInfo | null {
  const quest = QUESTS.find((q) => q.unlockLocationId === locationId);
  if (!quest) return null;
  return {
    questId: quest.id,
    questName: quest.name,
    questDescription: quest.description,
    questLocationId: quest.locationId,
    questLocationName: LOCATION_MAP[quest.locationId]?.name ?? quest.locationId,
    level: quest.level,
    stat: quest.stat,
    rumor: !!quest.rumor,
  };
}
