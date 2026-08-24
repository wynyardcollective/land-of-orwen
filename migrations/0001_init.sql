-- Player progress for The Land of Orwen
CREATE TABLE IF NOT EXISTS player_saves (
  player_id TEXT PRIMARY KEY NOT NULL,
  hero_name TEXT NOT NULL DEFAULT 'Wanderer',
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_player_saves_updated ON player_saves(updated_at DESC);
