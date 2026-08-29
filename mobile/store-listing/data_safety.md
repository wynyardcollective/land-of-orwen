# Google Play Data safety (draft answers)

Use this when completing the Play Console **Data safety** form for `nz.co.wynyardcollective.rough`.

## App type

- Online game client (WebView loads https://rough.co.nz)
- Internet required for gameplay and account features
- **Contains ads** (Google AdMob banner in Android app)

## Data collected (user-provided)

| Data type | Collected | Shared | Purpose | Optional |
|-----------|-----------|--------|---------|----------|
| Email address | Yes | No | Account authentication | No (if registering) |
| Password | Yes (hashed server-side) | No | Account authentication | No (if registering) |
| Other user-generated content (hero name, game save) | Yes | No | Gameplay / cloud save | Guest play optional |

## Data collected (automatic)

| Data type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| IP address, user agent, timestamps | Yes | No | Security, hosting logs (Cloudflare) |
| Advertising ID (Android) | Yes (via Google AdMob) | Yes (Google / ad partners) | Ad delivery, fraud prevention, measurement |
| App interactions / diagnostics | May be collected by Google AdMob | Yes (Google) | Advertising analytics |

## Not collected by us directly

- Location, contacts, photos, microphone, calendar, health data
- Payment / financial info (no IAP in v1)

## Security

- Passwords stored as bcrypt hashes
- Session cookie (httpOnly) for signed-in play
- HTTPS only in the Android app
- EU/UK: Google User Messaging Platform (UMP) consent where required

## Account deletion

Users can request account and save deletion by emailing admin@wynyardcollective.co.nz (document in store listing / privacy policy).

## Children

Not directed at children under 13 (see privacy policy). AdMob: configure child-directed treatment in AdMob if audience changes.

## Ads

- **Website:** Google AdSense (browser only)
- **Android app:** Google AdMob native banner — declare **Yes, contains ads** in Play Console
- Website AdSense is **not** loaded in the app WebView (`source=android-app`)
