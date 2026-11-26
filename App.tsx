import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { GAME_HTML } from './src/game-html';

// The game itself is an HTML5 canvas game (game/index.html). This app shell loads it into a
// WebView, keeps the save file in AsyncStorage and plays haptics when the knight gets hit.
// Ads and purchases are simulated inside the game; see README.md for wiring up real ones.

const SAVE_KEY = 'aura-knight-save-v1';

type GameMessage =
  | { type: 'save'; data: string }
  | { type: 'haptic' }
  | { type: 'ad'; kind: 'rewarded' | 'forced' }
  | { type: 'purchase'; sku: string };

export default function App() {
  // undefined while loading, null when there is no save yet
  const [save, setSave] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY)
      .then(setSave)
      .catch(() => setSave(null));
  }, []);

  const onMessage = (event: WebViewMessageEvent) => {
    let msg: GameMessage;
    try {
      msg = JSON.parse(event.nativeEvent.data) as GameMessage;
    } catch {
      return;
    }
    if (msg.type === 'save') {
      AsyncStorage.setItem(SAVE_KEY, msg.data).catch(() => {});
    } else if (msg.type === 'haptic') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }
    // 'ad' and 'purchase' are where AdMob rewarded ads and in-app purchases plug in later.
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {save !== undefined && (
        <WebView
          style={styles.web}
          originWhitelist={['*']}
          source={{ html: GAME_HTML, baseUrl: 'https://aura-knight.local/' }}
          injectedJavaScriptBeforeContentLoaded={`window.__AK_SAVE__ = ${JSON.stringify(save)}; true;`}
          onMessage={onMessage}
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          contentInsetAdjustmentBehavior="never"
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          setSupportMultipleWindows={false}
          textZoom={100}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#120d09' },
  web: { flex: 1, backgroundColor: '#120d09' },
});
