#!/usr/bin/env bash
# Generate rough release keystore + keystore.properties (gitignored).
# Run once from repo root. BACK UP the keystore and credentials file offline.

set -euo pipefail
cd "$(dirname "$0")/.."

ANDROID_DIR="mobile/android"
KEYSTORE="$ANDROID_DIR/rough-release.keystore"
PROPS="$ANDROID_DIR/keystore.properties"
CREDS="$ANDROID_DIR/keystore-credentials.txt"

if [[ -f "$KEYSTORE" ]]; then
  echo "Keystore already exists: $KEYSTORE"
  echo "Delete it first if you want to regenerate."
  exit 1
fi

STORE_PASS="$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)"
KEY_PASS="${STORE_PASS}"
ALIAS="rough"

keytool -genkey -v \
  -keystore "$KEYSTORE" \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$STORE_PASS" \
  -keypass "$KEY_PASS" \
  -dname "CN=rough, OU=Wynyard Collective, O=Wynyard Collective, L=Auckland, ST=NZ, C=NZ"

cat > "$PROPS" <<EOF
storeFile=rough-release.keystore
storePassword=${STORE_PASS}
keyPassword=${KEY_PASS}
keyAlias=${ALIAS}
EOF

cat > "$CREDS" <<EOF
rough Android release signing — KEEP OFFLINE AND PRIVATE
Generated: $(date -u +"%Y-%m-%d %H:%M UTC")

Keystore file: mobile/android/rough-release.keystore
Key alias: ${ALIAS}

Store password: ${STORE_PASS}
Key password: ${KEY_PASS}

You need this keystore for EVERY future Play Store update.
If you lose it, you cannot update the app (only create a new listing).

SHA-256 (for assetlinks.json):
EOF

keytool -list -v -keystore "$KEYSTORE" -alias "$ALIAS" \
  -storepass "$STORE_PASS" 2>/dev/null | grep -A1 "SHA256:" >> "$CREDS"

echo ""
echo "Created:"
echo "  $KEYSTORE"
echo "  $PROPS"
echo "  $CREDS"
echo ""
echo "Back up the keystore and $CREDS to a password manager or offline storage."
