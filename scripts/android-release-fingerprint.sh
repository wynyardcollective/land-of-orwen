#!/usr/bin/env bash
# Print SHA-256 fingerprint for Play / assetlinks.json
set -euo pipefail
cd "$(dirname "$0")/.."

ANDROID_DIR="mobile/android"
PROPS="$ANDROID_DIR/keystore.properties"

if [[ ! -f "$PROPS" ]]; then
  echo "No keystore.properties — run scripts/generate-android-keystore.sh first"
  exit 1
fi

STORE_FILE=$(grep '^storeFile=' "$PROPS" | cut -d= -f2)
STORE_PASS=$(grep '^storePassword=' "$PROPS" | cut -d= -f2)
ALIAS=$(grep '^keyAlias=' "$PROPS" | cut -d= -f2)

keytool -list -v \
  -keystore "$ANDROID_DIR/$STORE_FILE" \
  -alias "$ALIAS" \
  -storepass "$STORE_PASS" | grep -A1 "SHA256:"
