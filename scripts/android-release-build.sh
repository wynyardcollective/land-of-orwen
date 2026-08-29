#!/usr/bin/env bash
# Build signed release AAB for Google Play.
set -euo pipefail
cd "$(dirname "$0")/.."

ANDROID_DIR="mobile/android"
KEYSTORE="$ANDROID_DIR/rough-release.keystore"
PROPS="$ANDROID_DIR/keystore.properties"

if [[ ! -f "$KEYSTORE" ]] || [[ ! -f "$PROPS" ]]; then
  echo "Missing keystore. Run: bash scripts/generate-android-keystore.sh"
  exit 1
fi

export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"

echo "==> Capacitor sync"
npm run mobile:sync

echo "==> Gradle bundleRelease"
cd "$ANDROID_DIR"
./gradlew bundleRelease --no-daemon

AAB="app/build/outputs/bundle/release/app-release.aab"
if [[ ! -f "$AAB" ]]; then
  echo "AAB not found at $AAB"
  exit 1
fi

echo ""
echo "Release AAB ready:"
echo "  $(pwd)/$AAB"
ls -lh "$AAB"
