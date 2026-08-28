import type { ShopDef, ShopStockEntry } from "@/lib/game/types";

export const SHOPS: ShopDef[] = [
  {
    id: "calda-stall",
    locationId: "tarowen-square",
    name: "Calda's Market Stall",
    keeper: "Aunt Calda",
    description:
      "Drought ration lines and honest prices. Bandages, trail food, and herbs when the square runs dry.",
  },
  {
    id: "merrick-shed",
    locationId: "merrick-orchard",
    name: "Merrick's Shed Trade",
    keeper: "Old Merrick",
    description:
      "Orchard surplus and field remedies. Merrick charges neighbors less — strangers pay the board rate.",
  },
  {
    id: "wheelhouse-provisions",
    locationId: "stone-mill",
    name: "Wheelhouse Provisions",
    keeper: "Odo Stonewheel",
    description:
      "Forge coal, ore sacks, and mill bandages. Paid in gold so the wheel keeps turning.",
  },
  {
    id: "wreck-line-trader",
    locationId: "northern-shore",
    name: "Wreck Line Trader",
    keeper: "Brine Netta",
    description:
      "Fish and tonic off the wreck line. Netta trades for coin — the tide does not haggle.",
  },
  {
    id: "ford-camp-cache",
    locationId: "bracken-ford",
    name: "Ford Camp Cache",
    keeper: "Wade Brann",
    description:
      "Trail rations and reed bundles for walkers crossing the gravel ford.",
  },
  {
    id: "ledge-exchange",
    locationId: "clara-canyon",
    name: "Ledge Exchange",
    keeper: "Scholar Ila",
    description:
      "Smuggler prices for canyon ore and chipped stone. Ila marks everything up — the ledges are dangerous.",
  },
];

export const SHOP_STOCK: ShopStockEntry[] = [
  // —— Tarowen Square ——
  {
    id: "calda-bandage",
    shopId: "calda-stall",
    itemId: "field-bandage",
    amount: 1,
    price: 10,
  },
  {
    id: "calda-apple",
    shopId: "calda-stall",
    itemId: "dried-apple",
    amount: 2,
    price: 11,
  },
  {
    id: "calda-herbs",
    shopId: "calda-stall",
    itemId: "herb-bundle",
    amount: 3,
    price: 9,
  },
  {
    id: "calda-reed",
    shopId: "calda-stall",
    itemId: "pale-reed",
    amount: 4,
    price: 8,
  },
  {
    id: "calda-tonic",
    shopId: "calda-stall",
    itemId: "shore-tonic",
    amount: 1,
    price: 24,
    requiresFlags: ["shore_unlocked"],
  },
  // —— Merrick's Orchard ——
  {
    id: "merrick-apple",
    shopId: "merrick-shed",
    itemId: "dried-apple",
    amount: 3,
    price: 8,
  },
  {
    id: "merrick-bandage",
    shopId: "merrick-shed",
    itemId: "field-bandage",
    amount: 1,
    price: 9,
  },
  {
    id: "merrick-wood",
    shopId: "merrick-shed",
    itemId: "apple-wood",
    amount: 5,
    price: 12,
  },
  // —— Stone Mill ——
  {
    id: "mill-coal",
    shopId: "wheelhouse-provisions",
    itemId: "coal",
    amount: 3,
    price: 14,
    requiresFlags: ["mill_unlocked"],
  },
  {
    id: "mill-copper",
    shopId: "wheelhouse-provisions",
    itemId: "copper-ore",
    amount: 2,
    price: 18,
    requiresFlags: ["mill_unlocked"],
  },
  {
    id: "mill-bandage",
    shopId: "wheelhouse-provisions",
    itemId: "field-bandage",
    amount: 2,
    price: 20,
    requiresFlags: ["mill_unlocked"],
  },
  {
    id: "mill-iron-ore",
    shopId: "wheelhouse-provisions",
    itemId: "iron-ore",
    amount: 2,
    price: 22,
    requiresFlags: ["ledger_unlocked"],
  },
  // —— Northern Shore ——
  {
    id: "shore-raw-fish",
    shopId: "wreck-line-trader",
    itemId: "raw-fish",
    amount: 4,
    price: 11,
    requiresFlags: ["shore_unlocked"],
  },
  {
    id: "shore-cooked",
    shopId: "wreck-line-trader",
    itemId: "cooked-fish",
    amount: 3,
    price: 16,
    requiresFlags: ["shore_unlocked"],
  },
  {
    id: "shore-tonic",
    shopId: "wreck-line-trader",
    itemId: "shore-tonic",
    amount: 1,
    price: 22,
    requiresFlags: ["shore_unlocked"],
  },
  // —— Bracken Ford ——
  {
    id: "ford-ration",
    shopId: "ford-camp-cache",
    itemId: "trail-ration",
    amount: 2,
    price: 14,
    requiresFlags: ["ford_unlocked"],
  },
  {
    id: "ford-bandage",
    shopId: "ford-camp-cache",
    itemId: "field-bandage",
    amount: 1,
    price: 11,
    requiresFlags: ["ford_unlocked"],
  },
  {
    id: "ford-reed",
    shopId: "ford-camp-cache",
    itemId: "pale-reed",
    amount: 5,
    price: 9,
    requiresFlags: ["ford_unlocked"],
  },
  // —— Clara's Canyon ——
  {
    id: "canyon-copper",
    shopId: "ledge-exchange",
    itemId: "copper-ore",
    amount: 2,
    price: 20,
    requiresFlags: ["canyon_unlocked"],
  },
  {
    id: "canyon-gem-chip",
    shopId: "ledge-exchange",
    itemId: "gem-chip",
    amount: 1,
    price: 38,
    maxPurchases: 4,
    requiresFlags: ["canyon_unlocked"],
  },
  {
    id: "canyon-ash-ore",
    shopId: "ledge-exchange",
    itemId: "ash-ore",
    amount: 1,
    price: 28,
    maxPurchases: 6,
    requiresFlags: ["tables_unlocked"],
  },
];

export const SHOP_MAP = Object.fromEntries(
  SHOPS.map((s) => [s.id, s]),
) as Record<string, ShopDef>;

export const SHOP_STOCK_MAP = Object.fromEntries(
  SHOP_STOCK.map((s) => [s.id, s]),
) as Record<string, ShopStockEntry>;

export function shopAtLocation(locationId: string): ShopDef | undefined {
  return SHOPS.find((s) => s.locationId === locationId);
}

export function stockForShop(shopId: string): ShopStockEntry[] {
  return SHOP_STOCK.filter((s) => s.shopId === shopId);
}
