# FiTNESS YeGEVHA — System Edition

## Included
- Neon-blue branded icon and PWA manifest.
- 11 exercises, guided rep timer (one count every 3 seconds), 3 sets, 20-second rests.
- Six ranks (E through S), ten levels per rank, boss name list embedded in `app.js`.
- Boss gate prompt, boss victory and +300 XP reward.
- Settings for hunter profile, status, calendar, app information and email placeholder.
- Local browser storage.

## Publish on GitHub Pages
Upload all files in this folder to the repository root. Enable GitHub Pages, then open the site over HTTPS. On iPhone, use Safari → Share → Add to Home Screen.

## Important prototype limitations
- Boss names are hardcoded in `app.js`; you can edit the `bosses` array.
- Boss victory currently uses a confirmation button and does not verify exercise performance.
- Email is a placeholder only. Cloud sync/authentication is not configured; data stays in this browser/device.
- GPS running is not included in this rebuild.
- This is a working starter prototype; test progression and backups before relying on it.
