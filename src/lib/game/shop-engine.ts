import { ITEMS, SHOP_MAP, SHOP_STOCK_MAP } from "@/content";
import { clamp, computeStats, goldCap } from "./formulas";
import { addMaterials } from "./skill-engine";
import type { GameState, OwnedItem, ShopStockEntry } from "./types";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function shopStockAvailable(
  entry: ShopStockEntry,
  state: GameState,
): boolean {
  if (
    entry.requiresFlags?.some((flag) => !state.storyFlags.includes(flag))
  ) {
    return false;
  }
  if (entry.maxPurchases != null) {
    const bought = state.shopPurchases[entry.id] ?? 0;
    if (bought >= entry.maxPurchases) return false;
  }
  return true;
}

export function shopBuyPrice(state: GameState, entry: ShopStockEntry): number {
  const stats = computeStats(state);
  return Math.max(
    1,
    Math.round(entry.price - stats.charisma * 0.45),
  );
}

function createOwnedItem(defId: string, charisma: number): OwnedItem {
  const def = ITEMS[defId];
  const power = def?.healAmount
    ? 0
    : (def?.basePower ?? 0) + Math.floor(charisma / 4);
  return {
    uid: uid("shop"),
    defId,
    power,
  };
}

export function buyShopItem(
  state: GameState,
  shopId: string,
  stockId: string,
): GameState | { error: string } {
  if (state.active) {
    return { error: "Finish traveling, working, or fighting before shopping." };
  }
  if (state.pendingReward) {
    return { error: "Claim your reward first." };
  }

  const shop = SHOP_MAP[shopId];
  if (!shop) return { error: "Unknown shop." };
  if (shop.locationId !== state.locationId) {
    return { error: "You must be at this town to shop." };
  }

  const entry = SHOP_STOCK_MAP[stockId];
  if (!entry || entry.shopId !== shopId) {
    return { error: "That item isn't on the shelf." };
  }
  if (!shopStockAvailable(entry, state)) {
    return { error: "That line is sold out or not offered yet." };
  }

  const def = ITEMS[entry.itemId];
  if (!def) return { error: "Unknown item." };

  const price = shopBuyPrice(state, entry);
  if (state.gold < price) {
    return { error: `Need ${price} gold.` };
  }

  const stats = computeStats(state);
  const cap = goldCap(stats.constitution);
  const gold = clamp(state.gold - price, 0, cap);
  const shopPurchases = {
    ...state.shopPurchases,
    [entry.id]: (state.shopPurchases[entry.id] ?? 0) + 1,
  };

  if (def.material) {
    return {
      ...state,
      gold,
      materials: addMaterials(state.materials, {
        [entry.itemId]: entry.amount,
      }),
      shopPurchases,
      updatedAt: Date.now(),
    };
  }

  const inventory = [...state.inventory];
  if (def.healAmount || !def.slot) {
    for (let i = 0; i < entry.amount; i++) {
      inventory.push(createOwnedItem(entry.itemId, stats.charisma));
    }
  } else {
    inventory.push(createOwnedItem(entry.itemId, stats.charisma));
  }

  return {
    ...state,
    gold,
    inventory,
    shopPurchases,
    updatedAt: Date.now(),
  };
}
