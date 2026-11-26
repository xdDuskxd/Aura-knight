# Aura Knight

A brainrot auto-runner for iPhone and Android. Your wind-up knight runs on its own: tap the left half
of the screen to jump (tap again in the air to double jump), tap the right half to slash.
Farm aura orbs, slash brainrot creatures, and buy pay-to-win gear in the Armory, or watch ads to unlock it.

Built with Expo SDK 58. The game is an HTML5 canvas game in `game/index.html`. The app loads it into a WebView, so it runs in
Expo Go with no custom native build.

## Run it on your iPhone (Windows)

```powershell
npm install
npx expo start
```

Scan the QR code with the iPhone camera (Expo Go must be installed and signed in to the same Expo account as `npx expo login`).
If the phone can't reach the PC, use `npx expo start --tunnel`.

To play in a browser instead, run `npm run build:game` and open `dist-web/index.html`.

## What's in the game

- **30 levels in 3 worlds**: Ohio Castle, Rizz Ruins and Sigma Summit. Every 10th level ends with a boss (Mega Sharko).
- **Enemies**: Sharko Sneakerini (a shark in sneakers), Cappuccina Twirla (a ballerina coffee cup), and Pigeonardo Rizzi (a rizzler pigeon). High pigeons can be run under; low ones must be slashed or jumped.
- **Trend jokes**: "-1000 AURA" when you get hit, a "SIX SEVEN!!" bonus at a 7-kill combo, the Mewing Shield, Sigma Mode (a lightning pickup that makes you fast and invincible), and an NPC skin.
- **Stars**: 1 for clearing, 2 for half the orbs, 3 for 80% of the orbs with at most one hit.

## Monetisation design

| | Pay | Grind or watch ads |
|---|---|---|
| Currencies | Gems (premium) | Aura (earned in levels) |
| Gear | Some items cost gems only (Sigma Blade, Golden Mewing Armor, Aura Bubble) | Most items cost aura **or** a number of rewarded ads (Diamond Sword: 20,000 aura, 300 gems, or 15 ads) |
| Revive | 10 gems, doubling each time in the same run | One ad revive per run |
| Energy (5, +1 every 10 min) | Refill for 30 gems | 1 ad = +1 energy |
| Level reward | VIP doubles aura | 1 ad doubles the level's aura |
| Free gems | Packs €0.99–€49.99, a starter pack that disappears after 24 hours | 10 gems per ad, 5 times a day |
| Forced ads | VIP Rizz Pass removes them | An interstitial after every 3 cleared levels |

Rewarded ads are capped at 30 a day. All prices and limits are constants at the top of the script in `game/index.html`
(`ITEMS`, `PACKS`, `AD_CAP`, `REGEN`).

**Ads and purchases are simulated** in this build. No money is charged and no ad network is called.

## Making ads and purchases real

Both need native modules, so they don't work in Expo Go. You need a development build (`npx eas-cli@latest build --profile development`)
and an Apple Developer account.

1. **Rewarded and interstitial ads**: add `react-native-google-mobile-ads`. In `App.tsx`, handle the `{ type: 'ad' }` message:
   show the ad, then call `webViewRef.current.injectJavaScript('window.AK_adDone(true)')`. In the game, make `showAd()` wait for that callback
   instead of the fake countdown.
2. **In-app purchases**: use `expo-iap` or RevenueCat (`react-native-purchases`). Handle `{ type: 'purchase', sku }` the same way.
   Gems must be consumable products and VIP a non-consumable or subscription in App Store Connect.
3. **Store rules**: Apple and Google require clear prices, a working "restore purchases" button for VIP, and that rewarded ads are optional.
   If you add loot boxes or blind boxes, you must show the odds. If you target children under 13, ads and purchases are heavily restricted.

## Project layout

- `game/index.html`: the whole game (rendering, physics, levels, shop, simulated ads and purchases). Edit this.
- `scripts/build-game.js`: wraps the game into `src/game-html.ts` for the app and `dist-web/index.html` for browsers. Runs automatically before `npm start`.
- `App.tsx`: the WebView shell, save file (AsyncStorage) and haptics.

Before committing, run:

```powershell
npm run build:game; npx tsc --noEmit; npx expo lint
```
