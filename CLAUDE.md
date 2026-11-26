@AGENTS.md

# Aura Knight: project guide

A brainrot-themed auto-runner (Expo SDK 58) with a pay-to-win armory where rewarded ads are the free path. See README.md for the
game and monetisation design.

## How it's built

- The game is one file, `game/index.html`, written as a page fragment (no doctype/head/body). It's a canvas game plus DOM menus.
- `scripts/build-game.js` wraps it into a full document and writes `src/game-html.ts` (committed, generated) and `dist-web/index.html` (ignored).
  Re-run `npm run build:game` after every change to the game; `npm start` does it automatically.
- `App.tsx` loads the HTML into `react-native-webview`. The bridge is JSON over `postMessage`: `save`, `haptic`, `ad`, `purchase`.
  The save is passed back in at load through `window.__AK_SAVE__`.

## Decisions

- **Expo Go first.** The original developer is on Windows with an iPhone. Don't add native modules (AdMob, IAP) without asking; they need an EAS dev build.
- **Ads and purchases are simulated** and labelled as such in the UI. Keep that label until real ones are wired up.
- **Original characters only.** Brainrot style is fine, but don't use trademarked meme characters (Skibidi Toilet, Labubu, specific Italian-brainrot characters).

## Gotchas

- The game's CSS needs `[hidden] { display: none !important; }` because elements like `#ad` set `display`.
- `npx expo install` needs `EXPO_OFFLINE=1` in sandboxes that block api.expo.dev.
- Test the game in a browser with Playwright against `dist-web/index.html` at a landscape phone size (844×390).

## Checks before calling work done

```bash
npm run build:game && npx tsc --noEmit && npx expo lint
```
