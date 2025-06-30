// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useVideoPlayer, VideoView } from "expo-video";
// import React, { useEffect, useRef, useState } from "react";
// import { StyleSheet, View } from "react-native";

// const PlayerScreen = ({ route }) => {
//   const { video } = route.params;
//   const STORAGE_KEY = `video-progress-${video.id}`;
//   const player = useVideoPlayer(video.url, (player) => {
//     player.loop = false;
//   });

//   const [restored, setRestored] = useState(false);
//   const hasStarted = useRef(false); // To prevent double play

//   // STEP 1: Wait until duration is available, then resume
//   useEffect(() => {
//     if (!player || restored) return;

//     const waitForDuration = setInterval(async () => {
//       console.log(player.duration, hasStarted.current)
//       if (player.duration > 0 && !hasStarted.current) {
//         hasStarted.current = true;
//         clearInterval(waitForDuration);

//         const savedTime = await AsyncStorage.getItem(STORAGE_KEY);
//         const seekTo = savedTime ? parseFloat(savedTime) : 0;

//         if (seekTo > 0 && seekTo < player.duration - 3) {
//           player.currentTime = seekTo;
//           console.log("⏩ Seeking to saved time:", seekTo);
//         }

//         player.play(); 
//         setRestored(true);
//       }
//     }, 300);

//     return () => clearInterval(waitForDuration);
//   }, [player, restored]);

//   useEffect(() => {
//     if (!player || !restored) return;

//     const saveInterval = setInterval(() => {
//       const current = player.currentTime;
//       const duration = player.duration;

//       if (duration && current / duration < 0.95) {
//         AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
//         console.log("💾 Saved at", current);
//       } else {
//         AsyncStorage.removeItem(STORAGE_KEY);
//         console.log("✅ Finished, removed progress");
//       }
//     }, 5000);

//     return () => clearInterval(saveInterval);
//   }, [player, restored]);

//   return (
//     <View style={styles.container}>
//       <VideoView
//         style={styles.video}
//         player={player}
//         nativeControls
//         allowsFullscreen
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     justifyContent: "center",
//   },
//   video: {
//     width: "100%",
//     height: 275,
//   },
// });

// export default PlayerScreen;


// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useVideoPlayer, VideoView } from "expo-video";
// import React, { useEffect, useRef, useState } from "react";
// import { StyleSheet, View } from "react-native";

// const PlayerScreen = ({ route }) => {
//   const { video } = route.params;
//   const STORAGE_KEY = `video-progress-${video.id}`;
//   const player = useVideoPlayer(video.url, (player) => {
//     player.loop = false;
//   });

//   const [restored, setRestored] = useState(false);
//   const hasStarted = useRef(false);

//   useEffect(() => {
//     if (!player || restored) return;

//     const startTime = Date.now();

//     const waitUntilReady = setInterval(async () => {
//       const now = Date.now();
//       const isReady =
//         player.duration > 0 || player.currentTime > 0.1 || now - startTime > 10000;

//       if (isReady && !hasStarted.current) {
//         hasStarted.current = true;
//         clearInterval(waitUntilReady);

//         try {
//           const saved = await AsyncStorage.getItem(STORAGE_KEY);
//           const seekTo = saved ? parseFloat(saved) : 0;

//           if (seekTo > 0 && seekTo < player.duration - 3) {
//             player.currentTime = seekTo;
//             console.log("⏩ Resumed from:", seekTo);
//           }

//           player.play();
//         } catch (e) {
//           console.log("AsyncStorage error:", e);
//           player.play();
//         }

//         setRestored(true);
//       }
//     }, 300);

//     return () => clearInterval(waitUntilReady);
//   }, [player, restored]);

//   useEffect(() => {
//     if (!player || !restored) return;

//     const interval = setInterval(() => {
//       const time = player.currentTime;
//       const duration = player.duration;

//       if (duration && time / duration < 0.95) {
//         AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(time));
//       } else {
//         AsyncStorage.removeItem(STORAGE_KEY);
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [player, restored]);

//   return (
//     <View style={styles.container}>
//       <VideoView
//         style={styles.video}
//         player={player}
//         nativeControls
//         allowsFullscreen
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
//   video: { width: "100%", height: 275 },
// });

// export default PlayerScreen;


import AsyncStorage from "@react-native-async-storage/async-storage";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

const PlayerScreen = ({ route }) => {
  const { video } = route.params;
  const STORAGE_KEY = `video-progress-${video.id}`;
  const player = useVideoPlayer(video.url, (player) => {
    player.loop = false;
  });

  const [restored, setRestored] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!player || restored) return;
    const startTime = Date.now();
    const waitUntilReady = setInterval(async () => {
      const now = Date.now();
      const isReady = player.duration > 0 || player.currentTime > 0.1 || now - startTime > 10000;
      if (isReady && !hasStarted.current) {
        hasStarted.current = true;
        clearInterval(waitUntilReady);
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          const seekTo = saved ? parseFloat(saved) : 0;
          if (seekTo > 0 && seekTo < player.duration - 3) {
            player.currentTime = seekTo;
          }
          player.play();
        } catch (e) {
          player.play();
        }
        setRestored(true);
      }
    }, 300);
    return () => clearInterval(waitUntilReady);
  }, [player, restored]);

  useEffect(() => {
    if (!player || !restored) return;
    const interval = setInterval(() => {
      const time = player.currentTime;
      const duration = player.duration;
      if (duration && time / duration < 0.95) {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(time));
      } else {
        AsyncStorage.removeItem(STORAGE_KEY);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [player, restored]);

  return (
    <View style={playerStyles.container}>
      <VideoView
        style={playerStyles.video}
        player={player}
        nativeControls
        allowsFullscreen
      />
    </View>
  );
};

const playerStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
  video: { width: "100%", height: 275 },
});

export default PlayerScreen;