# Google Play Data safety (draft answers)

Use this when completing the Play Console **Data safety** form for `nz.co.wynyardcollective.landoforwen`.

## App type

- Online game client (WebView loads https://rough.co.nz)
- Internet required for gameplay and account features

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

## Not collected

- Location, contacts, photos, microphone, calendar, health data
- Payment / financial info (no IAP in v1)
- Advertising ID (no ads in Android app)

## Security

- Passwords stored as bcrypt hashes
- Session cookie (httpOnly) for signed-in play
- HTTPS only in the Android app

## Account deletion

Users can request account and save deletion by emailing admin@wynyardcollective.co.nz (document in store listing / privacy policy).

## Children

Not directed at children under 13 (see privacy policy).

## Ads

Website may show Google AdSense; **Android app does not load AdSense** (`source=android-app`).
